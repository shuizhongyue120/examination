import {ComponentClass} from 'react'
import Taro, {Component, Config, Animation} from '@tarojs/taro'
import {View, Button, Text, ScrollView, Image} from '@tarojs/components'
import {AtTabBar, AtTag, AtActivityIndicator, AtTextarea } from 'taro-ui'

import {connect} from '@tarojs/redux'

import {fetch} from '../../actions/paper'
import {IQuestionItem, colorGradeMap, trueorfalseChoose} from "../../constants/paper"

import { getSubText } from "../../function";
import {favorPaper, submitPaper, fetchPaperResults} from "../../function/api"

import './index.css'
//import "taro-ui/dist/weapp/css/index.css";

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性 需要显示声明
// connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props 这样才能完成类型检查和 IDE
// 的自动提示 使用函数模式则无此限制 ref:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  paper: {
    list: IQuestionItem[]
  }
}

type PageDispatchProps = {
  fetch: (id, category) => any
}

type PageOwnProps = {}

type PageState = {
  list?: IQuestionItem[];
  cur?: IQuestionItem;
  anwser?: string;
  animation?: any[];
  isOver?: boolean;
  isOpenResPan?:boolean;
  showCata?:boolean;
  loading?:boolean;
  leftSecond?:number;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props : IProps;
}

const tabBar = [
  {
    title: '收藏',
    iconType: 'star'
  }, {
    title: '60分00秒',
    iconType: 'clock'
  }, {
    title: '0/0',
    iconType: 'bookmark'
  }, {
    title: '交卷',
    iconType: 'upload'
  }
];

//查看答案解析
const overTabBar = [
  {
    title: '收藏',
    iconType: 'star'
  }, {
    title: '0/0',
    iconType: 'bookmark'
  }
];

@connect(({paper}) => ({paper}), (dispatch) => ({
  fetch(id, category) {
    dispatch(fetch(id, category))
  }
}))
class Index extends Component < IProps,
PageState > {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config : Config = {
    navigationBarTitleText: '模拟考试'
  }

  private startPosition = {
    x: -1,
    y: -1
  };
  private moveFlag = false;

  private course_id = "";
  private category = "";
  private timer = 0;

  constructor(props, context) {
    super(props, context);
    this.state = {
      list: undefined,
      cur: undefined,
      loading:true,
      animation: undefined,
      showCata:false, //是否展示题目目录
      isOpenResPan:false,//是否展示考试结果pan
      isOver: false, //是否考完了
      leftSecond: 3600
    }
  }

  componentWillReceiveProps(nextProps) {
    let {
      list = []
    } = nextProps.paper;
    if (!this.state.list&&list) {
      list = list.map((item,index)=>{
        item.idx = index +1;
        return item;
      })
      this.setState({list, cur: list[0], loading:false});
    }

  }
  componentDidMount() {
    let {id, category} = this.$router.params;
    this.course_id = id;
    this.category = category;
    Taro.setNavigationBarTitle({title:category + " 模拟考试"});
    this.setState({loading:true});
    this
      .props
      .fetch(id, category);
      this.timer = setInterval(()=>{
        let {leftSecond=3600,list=[]}= this.state;
        if(0 === leftSecond){
          clearInterval(this.timer);
          //判断是否已完成答题，没有提示是否进入不计时答题模式
          let finishSubs = list.filter(item=>item.subject_my_answer);
          let left = list.length - finishSubs.length;
          if(left>0){
            Taro.showModal({
              title: "提示",
              content: "答题时间到，是否继续答题？",
              success: (res) => {
               
              }
            })
            return;
          }
          return;
        }
      
        this.setState({
          leftSecond: leftSecond - 1
        })
      }, 1000);
  }
  componentWillUnmount() {
    this.setState({
      list: undefined,
      cur: undefined,
      animation: undefined,
      showCata:false, //是否展示题目目录
      isOpenResPan:false,//是否展示考试结果pan
      isOver: false, //是否考完了
      leftSecond: 3600
    });
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    let {
      list = [],
      cur = {},
      animation,
      showCata =false,
      isOver,
      isOpenResPan, 
      loading,
      leftSecond=3600
    } = this.state;
    let count = list.length;
    let idx = list.findIndex(item => cur.subject_id === item.subject_id);
    if(isOver){
      overTabBar[1].title = (idx + 1) + "/" + count;
    } else {
      tabBar[2].title = (idx + 1) + "/" + count;
      tabBar[1].title = this.formatTime(leftSecond);
    }
    let height =  Taro.getSystemInfoSync().windowHeight -75;
    let heightSty = "max-height:" + height + "PX;overflow-y: scroll;";
    return (
      <View class="paper">
         {loading && <View style="text-align:center;margin-top:20PX;">
          <View style="display:inline-block;">
            <AtActivityIndicator content='加载中...'></AtActivityIndicator>
          </View>
        </View>
}
      {!loading &&<ScrollView>
        <View
          class="question_main"
          animation={animation}
          onTouchstart={this
          .touchStartHandle
          .bind(this)}
          onTouchmove={this
          .touchMoveHandle
          .bind(this)}
          onTouchend={this
          .touchEndHandle
          .bind(this)} style={"width:" + count*100+"vw;"+heightSty}>
          {list.map(item => {
           
            let answers = JSON.parse(item.subject_answer || "{}");
            let keys = Object
             .keys(answers)
             .sort();
           let choosesRadios = keys.map(i => ({label: answers[i], value: i}));
           let url = item.subject_img;
            return <View class="question_wrap" key={"qus_"+item.subject_id}>
              <View>
                <AtTag type='primary' active={true} size="small" circle>{getSubText(item.subject_type)}</AtTag>
                <Text style="margin-left:10PX;">{item.idx}、{item.subject_name||"题目如下图所示："}（{item.subject_grade}分）</Text>
                {url &&
                <View style="margin-top:20PX;">
                  <Image src={url}/>
                </View>
                }
              </View>
      
              { "choice"===item.subject_type
              &&
              <View class="choose_wrap">
              {choosesRadios.map(j=>{
                let cls="";
                if(isOver){
                  if(item.subject_right_answer === j.value){
                    cls="right";
                  }
                  //回答正确 并且 答案和标识（A,B,CD） 匹配
                  if( item.subject_my_answer===item.subject_right_answer && item.subject_my_answer === j.value){
                    cls="right";
                  }
                  //回答错误 并且 答案和标识（A,B,CD） 匹配
                  if(item.subject_my_answer&& item.subject_my_answer!==item.subject_right_answer &&item.subject_my_answer === j.value){
                    cls="wrong";
                  }

                }else {
                  cls = item.subject_my_answer === j.value?"right": "";
                }
               
                 return (<View class="kcheckbox_item" data-val={j.value} onClick={this
                  .handleChange
                  .bind(this)}>
                 <View class={"kcheckbox_item_icon "+ cls }/>
                 <Text class="kcheckbox_item_text">{j.label}</Text>
               </View>);
              })}
              </View>
              }

            { "trueorfalse"===item.subject_type
              &&
              <View class="choose_wrap">
              {trueorfalseChoose.map((j)=>{
                let cls="";
                if(isOver){
                  if(item.subject_right_answer === j.value){
                    cls="right";
                  }
                  //回答正确 并且 答案和标识 匹配
                  if( item.subject_my_answer===item.subject_right_answer && item.subject_my_answer === j.value){
                    cls="right";
                  }
                  //回答错误 并且 答案和标识 匹配
                  if(item.subject_my_answer&& item.subject_my_answer!==item.subject_right_answer &&item.subject_my_answer === j.value){
                    cls="wrong";
                  }

                }else {
                  cls = item.subject_my_answer === j.value?"right": "";
                }
                return (<View class="kcheckbox_item" data-val={j.value} onClick={this
                  .handleChange
                  .bind(this)}>
                 <View class={"kcheckbox_item_icon "+ cls }/>
                 <Text class="kcheckbox_item_text">{j.label}</Text>
               </View>);
              })}
              </View>
              }

              {("text"===item.subject_type ||"trueorfalsetext"=== item.subject_type)&&
              <View style="margin-top:20PX;">
               <AtTextarea
                 value={item.subject_my_answer}
                 count={false}
                 onChange={this.handleTextChange.bind(this)}
                 height={240}
                 showConfirmBar={true}
                 placeholder='你的答案是...'
               />
                <Button size="mini" className="item_btn"
                onClick={this.handleTextSubChange} style="float:right;margin-top:20PX;">提交答案</Button>
               </View>
              }

              {isOver &&<View class="question_answer_wrap">
                <View class="answer_title">
                  <Text>题目解析</Text>
                </View>
                <View class="answer_desc">
                  <View style="margin-bottom:10PX;">
                  {
                    !item.subject_my_answer &&<Text>此题您未作答；</Text>
                  }
                  {item.subject_my_answer===item.subject_right_answer 
                    &&<Text style="font-weight: 800;">回答正确；</Text>
                  }
                  {(item.subject_my_answer&&item.subject_my_answer!==item.subject_right_answer) && <Text>你的答案是 {item.subject_my_answer}，
                    <Text style="font-weight: 800;">回答错误；</Text>
                    </Text>
                  }
                  </View>
                  {("trueorfalse"===item.subject_type || "choice"===item.subject_type)&& <Text>答案：<Text style="font-weight: 800;">{item.subject_right_answer}</Text></Text>}
                  {("trueorfalsetext"===item.subject_type || "text"===item.subject_type) && 
                  <View>
                    <Text>{item.subject_right_answer}</Text>
                  </View>
                }
                </View>
                <View>
                  <Text>{item.subject_tips}</Text>
                </View>
              </View>
              }
            </View>
          })}
        </View>
      </ScrollView>}
      <View>
          {!isOver?<AtTabBar
            tabList={tabBar}
            onClick={this
            .handleTabBarClick
            .bind(this)}
            current={1 === cur.is_favorite
            ? 0
            : 1}
            fixed={true}/>:<AtTabBar
            tabList={overTabBar}
            onClick={this
            .handleOverTabBarClick
            .bind(this)}
            current={1 === cur.is_favorite
            ? 0
            : 1}
            fixed={true}/>}
        </View>
        {showCata && this.renderCataPan()}
        {(isOver && isOpenResPan)
          ? this.renderAnswerPan()
          : ""}
      </View>
    )
  }

//答题索引目录
 private renderCataPan(){
   let {list = [], cur ={}} = this.state;
  return  <View class="cata_mask" onClick={this.hideCataPan.bind(this)}>
  <View class="cata_wrap" data-cid="cata"><View class = "cata_list" > {
      list.map(item => {
        let cls = (item.subject_my_answer)
          ? "right"
          : "";
        return <View class={"cata_item " + cls} key={"ans_"+item.subject_id} data-sid={item.subject_id} onClick={this.jumpHandle.bind(this)}>
          <Text>{item.idx}</Text>
        </View>
      })
    } </View>
  </View>
  </View>
 }

 private hideCataPan(e){
   if("cata"===e.target.dataset.cid){
    return;
   }
   this.setState({showCata:false});
 }
 //渲染 答题结果界面
  private renderAnswerPan() {
    let {
      list = []
    } = this.state;

    let grade = 0;
    let total = 0;
    let rightCount = 0;
    list.forEach(item=>{
      grade = grade+ (item.subject_right_answer === item.subject_my_answer?1:0)*(item.subject_grade||0);
      total +=(item.subject_grade||0);
      if(item.subject_right_answer === item.subject_my_answer){
        rightCount = rightCount + 1;
      }
    });

    let choiceList = list.filter(item => item.subject_type === "choice"); //单选题列表
    let tfList = list.filter(item => item.subject_type === "trueorfalse"); //判断
    let tftextList = list.filter(item => item.subject_type === "trueorfalsetext"); //单选题列表
    let textList = list.filter(item => item.subject_type === "text"); //简答题目列表
 
    let grade100Precent = Math.round((grade/total) *100)
    let gColor = colorGradeMap.find(item=>(item.min<=grade100Precent && item.max>=grade100Precent));

    let sty = "background-color:" + (gColor? gColor.color: "");

    return <View class="answer_wrap">
      <View class="answer_grade">
        <View class="grade" style={sty}>
          <View class="grade_round">
            <View><Text class="text">{grade}</Text></View>
            <View style="margin-top:-5PX;"><Text>得分</Text></View>
          </View>
        
        </View>
        <View class="desc">
          <View class="desc_item">
            <View><Text>得分/总分</Text></View>
            <View><Text>{grade}/{total}</Text></View>
          </View>
          <View class="desc_item">
            <View><Text>正确率</Text></View>
            <View><Text>{rightCount}/{list.length}</Text></View>
          </View>
        </View>
      </View>
      {choiceList.length > 0 &&< View class="answer_title"> 单选题 </View>}
      {choiceList.length > 0 &&
        <View class = "answer_list"> {
          choiceList.map(item => {
            let cls = item.subject_right_answer === item.subject_my_answer
              ? "right"
              : "wrong";
              if(!item.subject_my_answer){
                cls="";
              }
            return <View class={"answer_item " + cls} key={"ans_"+item.subject_id} data-sid={item.subject_id} onClick={this.jumpHandle.bind(this)}>
              <Text>{item.idx}</Text>
            </View>
          })
        } </View>
      }
      {tfList.length > 0 &&< View class="answer_title"> 判断题 </View>}
      {tfList.length > 0 &&
        <View class = "answer_list"> {
          tfList.map(item => {
            let cls = item.subject_right_answer === item.subject_my_answer
              ? "right"
              : "wrong";
              if(!item.subject_my_answer){
                cls="";
              }
            return <View class={"answer_item " + cls} key={"ans_"+item.subject_id} data-sid={item.subject_id} onClick={this.jumpHandle.bind(this)}>
              <Text>{item.idx}</Text>
            </View>
          })
        } </View>
      }
      {tftextList.length > 0 &&< View class="answer_title"> 判断简答题 </View>}
      {tftextList.length > 0 &&
        <View class = "answer_list"> {
          tftextList.map(item => {
            let cls = item.subject_right_answer === item.subject_my_answer
              ? "right"
              : "wrong";
              if(!item.subject_my_answer){
                cls="";
              }
            return <View class={"answer_item " + cls} key={"ans_"+item.subject_id} data-sid={item.subject_id} onClick={this.jumpHandle.bind(this)}>
              <Text>{item.idx}</Text>
            </View>
          })
        } </View>
      }
      {textList.length > 0 &&< View class="answer_title"> 简答题 </View>}
      {textList.length > 0 &&<View class="answer_list">
        {textList.map(item => {
          let cls = item.subject_right_answer === item.subject_my_answer
            ? "right"
            : "wrong";
            if(!item.subject_my_answer){
              cls="";
            }
          return <View class={"answer_item " + cls} key={"ans_"+item.subject_id} data-sid={item.subject_id} onClick={this.jumpHandle.bind(this)}>
            <Text>{item.idx}</Text>
          </View>
        })
        }
      </View>}
      <View style="text-align: center;margin-top:10PX;margin-bottom:20PX;">
        <Button class="item_btn" size="mini" onClick={this.analysisHandle.bind(this)}>查看解析</Button>
      </View>
    </View>
  }
  //跳转到指定题目
  private jumpHandle(e){
    let {
      list = []
    } = this.state;
    let sid = e.currentTarget.dataset.sid;
    let idx = list.findIndex(item=>item.subject_id === sid);
    this.setState({
      isOpenResPan:false,
      cur: Object.assign({}, list[idx]),
      animation: this.getAnimate(idx),
      showCata:false
    });
  }
  private analysisHandle(){
    let {
      list = []
    } = this.state;
    this.setState({
      isOpenResPan:false,
      cur: Object.assign({}, list[0]),
      animation: this.getAnimate(0)
    });
  }
  touchStartHandle(e) {
    this.startPosition = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    };
  }

  touchMoveHandle(e) {
    this.moveFlag = true;
  }
  touchEndHandle(e) {
    if (!this.moveFlag) {
      return;
    }

    let {pageX, pageY} = e.changedTouches[0];
    let {x, y} = this.startPosition;
    let lenY = Math.abs(pageY - y);
    let lenX = pageX - x;
    let diff = 0;
    if (lenX >= 50) {
      diff = -1;
    }
    if (lenX <= -50) {
      diff = 1;
    }
    if(lenY>30){
      return;
    }
    let {
      list = [],
      anwser,
      cur = {}
    } = this.state;
    let idx = list.findIndex(item => item.subject_id === cur.subject_id);
    let isLast = idx === list.length - 1;
    let isFirst = idx === 0;
    this.startPosition = {
      x: -1,
      y: -1
    };
    let nextIdx = idx + 1 * diff;
    if (isFirst && -1 === diff) {
      this.moveFlag = false;
      Taro.showToast({title: "已经是第一个了"});
      return;
    }
    if (isLast && 1 === diff) {
      this.moveFlag = false;
      Taro.showToast({title: "已经是最后一个了"});
      return;
    }
    this.setState({
      cur: Object.assign({}, list[nextIdx]),
      anwser: isLast
        ? anwser
        : "",
      animation: this.getAnimate(nextIdx)
    });

    setTimeout(() => {
      this.moveFlag = false;
    }, 450);

  }
  handleTextChange(e) {
    let value = e.currentTarget.value;
    console.log(value);
    let {
      list = [],
      cur = {}
    } = this.state;
    let idx = 0;
    list = list.map((item, index) => {
      if (cur.subject_id === item.subject_id) {
        item.subject_my_answer = value;
        idx = index;
      }
      return item;
    });

    this.setState({list});
  }

  handleTextSubChange(e){
    console.log("dfsdf",e);
    let {
      list = [],
      cur = {}
    } = this.state;
    let idx = 0;
    list = list.map((item, index) => {
      if (cur.subject_id === item.subject_id) {
        idx = index;
      }
      return item;
    });

    setTimeout(() => {
      let isLast = idx === list.length - 1;
      if(isLast){
        Taro.showToast({title:"答题完毕，请交卷。"});
        return;
      }

      let nextIdx = idx + 1;
      this.setState({
        cur: Object.assign({}, list[nextIdx]),
        animation: this.getAnimate(nextIdx)
      });
    }, 200);
  }

  handleChange(e) {
    let value = e.currentTarget.dataset.val;
    let {
      list = [],
      cur = {}
    } = this.state;
    let idx = 0;
    list = list.map((item, index) => {
      if (cur.subject_id === item.subject_id) {
        item.subject_my_answer = value;
        idx = index;
      }
      return item;
    });

    this.setState({list});
    setTimeout(() => {
      let isLast = idx === list.length - 1;
      if(isLast){
        Taro.showToast({title:"答题完毕，请交卷。"});
        return;
      }

      let nextIdx = idx + 1;
      this.setState({
        cur: Object.assign({}, list[nextIdx]),
        animation: this.getAnimate(nextIdx)
      });
    }, 200);
  }
  formatTime(second: number){
    let mins = Math.floor(second/60);
    let seconds = second%60;
    if(mins>=1){
      return mins + "分" + (seconds||"00") + "秒";
    }else {
      return  "00分" + (seconds||"00") + "秒";
    }
  }
  getAnimate(idx) {
    let animation = Taro.createAnimation({duration: 400, timingFunction: 'ease', delay: 0})
    animation
      .translateX(-100 * idx + "vw")
      .step();
    return animation.export();
  }
  handleOverTabBarClick(value : number){
    let {loading,list=[]
    } = this.state;
    if(loading){
      return;
    }
    if(list.length===0){
      return;
    }

    if(0===value){
      this.favorHandle();
    }else if(1 === value){
      this.setState({showCata:true});
    }
  }
  handleTabBarClick(value : number) {
    let {
      list = [],loading
    } = this.state;
    if(loading){
      return;
    }
    if(list.length===0){
      return;
    }
    if (3 === value) {
      Taro.showModal({
        title: "提示",
        content: "确认要交卷",
        success: (res) => {
          if (res.confirm) {
           
            clearInterval(this.timer); //交卷后停止计时
            let array = list.map(item => ({
              subject_id: item.subject_id,
              exam_answer: item.subject_my_answer || ""
            }))
            submitPaper(this.course_id, this.category, array).then(({statusCode, data}) => {
              if (200 === statusCode) {
                //Taro.showToast({title: "交卷成功"});
                fetchPaperResults(this.course_id, data.exam_id, this.category).then(({statusCode, data}) => {
                  if (200 === statusCode) {
                    this.setState({isOver: true,isOpenResPan:true});
                  } else {
                    Taro.showToast({title: "获取考试结果失败，请重试", icon: "none"});
                  }

                });
              } else {
                Taro.showToast({title: "交卷失败，请重试", icon: "none"});
              }
            })

          }
        }
      })
    } else if (0 === value) {
      this.favorHandle();
    } else if (2 === value) {
     
      this.setState({showCata:true});
    }
  }
  favorHandle() {
    let {
      list = [],
      cur = {}
    } = this.state;
    let action = 1 === cur.is_favorite
      ? 0
      : 1;
    favorPaper(cur.course_id, cur.subject_id, action).then(data => {
      list = list.map((item) => {
        if (cur.subject_id === item.subject_id) {
          item.is_favorite = action;
          cur.is_favorite = action;
        }
        return item;
      });

      this.setState({list,cur});
      Taro.showToast({
        title: action
          ? "收藏成功"
          : "取消收藏成功"
      });
    }).catch(() => {
      Taro.showToast({
        title: action
          ? "收藏失败"
          : "取消收藏失败",
        icon: "none"
      });
    })
  }

}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性 这样在使用这个子类时 Ts 才不会提示缺少 JSX
// 类型参数错误
//
// #endregion

export default Index as ComponentClass < PageOwnProps,
PageState >
