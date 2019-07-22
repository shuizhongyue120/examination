import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Text, Progress} from '@tarojs/components'
import {AtTabBar, AtRadio, AtTag} from 'taro-ui'
import {connect} from '@tarojs/redux'

import {fetch, submit} from '../../actions/paper'
import {IQuestionItem} from "../../constants/paper"

import {favorPaper} from "../../function/api"

import './index.css'
import "taro-ui/dist/weapp/css/index.css";

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
  curIndex: number;
  anwser?: string;
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
    title: '2分32秒',
    iconType: 'clock'
  }, {
    title: '0/0',
    iconType: 'bookmark'
  }, {
    title: '交卷',
    iconType: 'upload'
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
    navigationBarTitleText: '开始考试'
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      list: [],
      curIndex: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
    let {
      list = []
    } = nextProps.paper;
    if (list) {
      this.setState({list});
    }

  }
  componentDidMount() {
    let {id, category} = this.$router.params;
    this
      .props
      .fetch(id, category);
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    let {
      list = [],
      curIndex,
      anwser = ""
    } = this.state;

    if (list.length === 0) {
      return;
    }

    let data = list[curIndex];
    let answer = JSON.parse(data.subject_answer||"{}");
    let keys = Object.keys(answer).sort();
    let choosesRadios = keys.map(item=>({label:answer[item],value:item}))
    tabBar[2].title = curIndex + "/" + list.length;
    return (
      <View className='index'>
        {/* <View class="header_wrap">
        <AtTag type='primary' circle>单选</AtTag><Text>一.单选题</Text>
        </View> */}
        <View class="question_wrap">
          <View>
            <AtTag type='primary' active={true} size="small" circle>{data.subject_type === "choice"?"单选":"简答"}</AtTag>
            <Text style="margin-left:10px;">{data.subject_id}、{data.subject_name}</Text>
          </View>
          <View class="choose_wrap">
            <AtRadio
              options={choosesRadios}
              value={anwser}
              onClick={this
              .handleChange
              .bind(this)}/>
          </View>
        </View>

        <View>
          <AtTabBar
            tabList={tabBar}
            onClick={this
            .handleClick
            .bind(this)}
            current={data.hasStar
            ? 0
            : 1}
            fixed={true}/>
        </View>
      </View>
    )

  }
  handleChange(value) {
    console.log(value);
    let {
      list = [],
      curIndex
    } = this.state;
    list = list.map((item, index) => {
      if (curIndex === index) {
        item.subject_my_answer = value;
      }
      return item;
    });

    this.setState({list, anwser: value});
    setTimeout(() => {
      this.setState({
        curIndex: curIndex + 1
      });
    }, 300);
  }
  handleClick(value : number) {
    let {
      list = [],
      curIndex
    } = this.state;
    if (3 === value) {
      Taro.showModal({
        title: "提示",
        content: "确认要交卷",
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({title: "交卷成功"});
          }
        }
      })
    } else if (0 === value) {
      this.favorHandle();
    } else if (2 === value) {}
  }
  bookMarkHandle() {}
  favorHandle() {
    let {
      list = [],
      curIndex
    } = this.state;
    favorPaper(curIndex).then(data => {
      list = list.map((item, index) => {
        if (curIndex === index) {
          item.hasStar = true;
        }
        return item;
      });

      this.setState({list});
      Taro.showToast({title: "收藏成功"});
    }).catch(() => {
      Taro.showToast({title: "收藏失败", icon: "none"});
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
