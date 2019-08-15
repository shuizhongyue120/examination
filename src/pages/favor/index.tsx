import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import {AtTabBar, AtRadio, AtTag, AtActivityIndicator, AtDivider} from 'taro-ui'
import {connect} from '@tarojs/redux'
import {IQuestionItem, colorGradeMap} from "../../constants/paper"
import {fetch} from '../../actions/favor'
import {favorPaper} from "../../function/api"

import './index.css'
import { getSubText } from '../../function';

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性 需要显示声明
// connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props 这样才能完成类型检查和 IDE
// 的自动提示 使用函数模式则无此限制 ref:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  favor: {
    list: IQuestionItem[]
  }
}

type PageDispatchProps = {
  fetch: () => any
}

type PageOwnProps = {}

type PageState = {
  course_name?: string;
  list?: IQuestionItem[];
  cur?: IQuestionItem;
  loading?: boolean;
  animation?: any[];
  showCata?: boolean;
}

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

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props : IProps;
}

@connect(({favor}) => ({favor}), (dispatch) => ({
  fetch() {
    dispatch(fetch())
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
    navigationBarTitleText: '收藏夹'
  }

  private startPosition = {
    x: -1,
    y: -1
  };
  private moveFlag = false;

  constructor(props, context) {
    super(props, context);
    this.state = {
      list: undefined,
      cur: undefined,
      course_name: "",
      loading: true,
      showCata: false //是否展示题目目录
    }
  }

  componentWillReceiveProps(nextProps) {
    let {name} = this.$router.params;
    let {
      list = []
    } = nextProps.favor;
    if (!this.state.list && list) {
      let data = list.find(item => item.course_name === name);
      if (data) {
        let {subjects, course_name} = data;
        subjects.forEach((item, index) => {
          item.is_favorite = 1;
          item.idx = index+1;
        });
        this.setState({list: subjects, course_name, cur: subjects[0], loading: false});
      } else {
        this.setState({list: [], loading: false});
      }

    }

  }
  componentDidMount() {
    this.setState({loading: true})
    this
      .props
      .fetch();
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    let {
      list = [],
      cur = {},
      animation,
      showCata = false,
      loading
    } = this.state;
    let count = list.length;
    let idx = list.findIndex(item => cur.subject_id === item.subject_id);
    overTabBar[1].title = (idx + 1) + "/" + count;

    return (
      <View className='favor'>
        {loading && <View style="text-align:center;margin-top:20PX;">
          <View style="display:inline-block;">
            <AtActivityIndicator content='加载中...'></AtActivityIndicator>
          </View>
        </View>
}
        {0 < list.length && !loading && <ScrollView>
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
            .bind(this)}
            style={"width:" + count * 100 + "vw;"}>
            {list.map((item) => {
              let answers = JSON.parse(item.subject_answer || "{}");
              let keys = Object
                .keys(answers)
                .sort();
              let choosesRadios = keys.map(i => ({label: answers[i], value: i}));
              let url = item.subject_img;
              return <View class="question_wrap" key={"qus_" + item.subject_id}>
                <View>
                  <AtTag type='primary' active={true} size="small" circle>{getSubText(item.subject_type)}</AtTag>
                  <Text style="margin-left:10px;">{item.subject_name}（{item.subject_grade}分）</Text>
                  {url &&
                <View style="margin-top:10px;">
                  <Image src={url ||"https://6578-examination-4a5460-1259638096.tcb.qcloud.la/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190812065002.jpg"}/>
                </View>
                }
                </View>
                <View class="choose_wrap">
                  {choosesRadios.map(j => {
                    const {subject_right_answer} = item;
                    let cls = subject_right_answer === j.value
                      ? "right"
                      : "";

                    return (
                      <View class="kcheckbox_item" data-val={j.value}>
                        <View class={"kcheckbox_item_icon " + cls}/>
                        <Text class="kcheckbox_item_text">{j.label}</Text>
                      </View>
                    );
                  })}
                </View>
                <View class="question_answer_wrap">
                  <View class="answer_title">
                    <Text>题目解析</Text>
                  </View>
                  <View class="answer_desc">
                    <Text>
                      正确答案是
                      <Text style="font-weight: 800;">{item.subject_right_answer}</Text>
                    </Text>
                  </View>
                  <View>
                    <Text>{item.subject_tips}</Text>
                  </View>
                </View>
              </View>
            })}
          </View>
        </ScrollView>
}
        {0 === list.length && !loading && <AtDivider content='暂无' fontColor='#2d8cf0' lineColor='#2d8cf0'/>}
        <View>
          <AtTabBar
            tabList={overTabBar}
            onClick={this
            .handleOverTabBarClick
            .bind(this)}
            current={1 === cur.is_favorite
            ? 0
            : 1}
            fixed={true}/>
        </View>
        {showCata && this.renderCataPan()}
      </View>
    )

  }
  //答题索引目录
  private renderCataPan() {
    let {
      list = [],
      cur = {}
    } = this.state;
    return <View class="cata_mask" onClick={this
      .hideCataPan
      .bind(this)}>
      <View class="cata_wrap" data-cid="cata">
        <View class="cata_list">
          {list.map(item => {
            let cls = (item.subject_id || 1) === (cur.subject_id || 1)
              ? "right"
              : "";
            return <View
              class={"cata_item " + cls}
              key={"ans_" + item.subject_id}
              data-sid={item.subject_id}
              onClick={this
              .jumpHandle
              .bind(this)}>
              <Text>{item.idx}</Text>
            </View>
          })
}
        </View>
      </View>
    </View>
  }
  //跳转到指定题目
  private jumpHandle(e) {
    let {
      list = []
    } = this.state;
    let sid = e.currentTarget.dataset.sid;
    let idx = list.findIndex(item => item.subject_id === sid);
    this.setState({
      cur: Object.assign({}, list[idx]),
      animation: this.getAnimate(idx),
      showCata: false
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
    if (lenY > 30) {
      return;
    }
    let {
      list = [],
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
      animation: this.getAnimate(nextIdx)
    });

    setTimeout(() => {
      this.moveFlag = false;
    }, 450);

  }
  private hideCataPan(e) {
    if ("cata" === e.target.dataset.cid) {
      return;
    }
    this.setState({showCata: false});
  }

  getAnimate(idx) {
    let animation = Taro.createAnimation({duration: 400, timingFunction: 'ease', delay: 0})
    animation
      .translateX(-100 * idx + "vw")
      .step();
    return animation.export();
  }

  handleOverTabBarClick(value : number) {
    if (0 === value) {
      this.favorHandle();
    } else if (1 === value) {
      this.setState({showCata: true});
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

      this.setState({list, cur});
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
