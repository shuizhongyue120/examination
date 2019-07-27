import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Text, Progress} from '@tarojs/components'
import {AtTabBar, AtRadio, AtTag} from 'taro-ui'
import {connect} from '@tarojs/redux'

import {fetch} from '../../actions/favor'
//import {IQuestionItem} from "../../constants/favor"

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
  favor: {
    list: any[]
  }
}

type PageDispatchProps = {
  fetch: () => any
}

type PageOwnProps = {}

type PageState = {
  course_name?: string;
  list?: any[];
  cur?: any;
  anwser?: string;
}

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
    navigationBarTitleText: '收藏'
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      list: [],
      cur: undefined,
      course_name: ""
    }
  }

  componentWillReceiveProps(nextProps) {
    let {name} = this.$router.params;
    console.log(this.props, nextProps);
    let {
      list = []
    } = nextProps.favor;
    if (list) {
      let data = list.find(item => item.course_name === name);
      if (data) {
        let {subjects, course_name} = data;
        this.setState({list: subjects, course_name, cur: subjects[0]});
      }

    }

  }
  componentDidMount() {
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
      anwser = ""
    } = this.state;

    if (list.length === 0) {
      return;
    }

    let answer = JSON.parse(cur.subject_answer || "{}");
    let keys = Object
      .keys(answer)
      .sort();
    let choosesRadios = keys.map(item => ({label: answer[item], value: item}))
    let isChoice = cur.subject_type === "choice";
    return (
      <View className='index'>
        <View class="question_wrap">
          <View>
            <AtTag type='primary' active={true} size="small" circle>{isChoice
                ? "单选"
                : "简答"}</AtTag>
            <Text style="margin-left:10px;">{cur.subject_name}（{cur.subject_grade}分）</Text>
          </View>
          {isChoice
            ? <View class="choose_wrap">
                <AtRadio options={choosesRadios} value={cur.subject_right_answer}/>
              </View>
            : ""}
          <View class="answer_wrap">
            <View class="answer_title">
              <Text>题目解析：</Text>
            </View>
            <View>
              <Text>正确答案是 <Text style="font-weight: 800;">{cur.subject_right_answer}</Text></Text>
            </View>
            <View>
              <Text>{cur.subject_tips}</Text>
            </View>
          </View>
        </View>
      </View>
    )

  }
  handleChange(value) {
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

    this.setState({list, anwser: value});
    setTimeout(() => {
      this.setState({
        cur: Object.assign({}, list[idx])
      });
    }, 300);
  }

  bookMarkHandle() {}
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性 这样在使用这个子类时 Ts 才不会提示缺少 JSX
// 类型参数错误
//
// #endregion

export default Index as ComponentClass < PageOwnProps,
PageState >
