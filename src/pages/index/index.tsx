import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {
  View,
  Swiper,
  SwiperItem,
  Button,
  Input,
  Picker
} from '@tarojs/components'
import {AtNoticebar} from 'taro-ui'
import {connect} from '@tarojs/redux'
import {fetchInfo, isLogin, fetchCourses} from "../../actions/user"
import {goLogin, getLoginToken} from "../../function/user"
import {sendRequest} from "../../function/api"

import './index.css'
//import "taro-ui/dist/weapp/css/index.css"; #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性 需要显示声明
// connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props 这样才能完成类型检查和 IDE
// 的自动提示 使用函数模式则无此限制 ref:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  user: {
    info: null,
    logined: false,
    courses: undefined
  }
}
type PageDispatchProps = {
  fetchInfo: () => any,
  isLogin: () => any;
  fetchCourses: () => any;
}

type PageOwnProps = {}
type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props : IProps;
}

@connect(({user}) => ({user}), (dispatch) => ({
  fetchInfo() {
    dispatch(fetchInfo());
  },
  isLogin() {
    dispatch(isLogin());
  },
  fetchCourses() {
    dispatch(fetchCourses());
  }
}))
class Index extends Component < IProps,
any > {

  private timer = 0;
  constructor(props, context) {
    super(props, context);
    this.state = {
      showLoginBtn: false,
      info: undefined,
      isVerify: false,
      courses: undefined,
      course: "",
      url: "",
      method: "GET",
      param: ""
    };
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config : Config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
    let {logined} = this.props.user;
    let {info, courses} = this.state;
    let nextLogined = nextProps.user.logined;

    if (!nextLogined) {
      this.setState({showLoginBtn: true, info: undefined, isVerify: true, courses: undefined, course: ""});
      return;
    }
    if (!logined && nextLogined) {
      this.setState({showLoginBtn: false});
      this
        .props
        .fetchInfo();
      return;
    }

    let nextinfo = nextProps.user.info;
    if (!info) {
      this.setState({info: nextinfo});
      if (nextinfo) {
        this
          .props
          .fetchCourses();
      }
      return;
    }

    let nextcourses = nextProps.user.courses;
    if (!courses) {
      this.setState({
        courses: nextcourses,
        isVerify: !!nextcourses
      });
    }
  }
  componentDidMount() {
    console.log("index did mount");
    this.pullHandle();
  }

  pullHandle() {
    this.timer = setInterval(() => {
      let loginover = Taro.getStorageSync("loginover");
      if (loginover>=1) {
        this
          .props
          .isLogin();
        clearInterval(this.timer);
      }
      console.log("wait ", loginover);
    }, 50)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidShow() {}

  componentDidHide() {}

  private getNoticeMsg() {
    let {info} = this.state;
    let majorStr = "";
    if (info) {
      majorStr = info.category_name + " " + info.major_name;
    }

    return majorStr;
  }

  render() {
    let {showLoginBtn, isVerify, url, method, param} = this.state;

    let msg = this.getNoticeMsg();
    return (
      <View className='index'>
        <Swiper
          className='m_swiper'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          autoplay>
          <SwiperItem>
            <image
              mode="scaleToFill"
              src="https://6578-examination-4a5460-1259638096.tcb.qcloud.la/img/1.jpg?sign=38cf9db0ca42ad03813474c627883adf&t=1563608704"></image>
          </SwiperItem>
          <SwiperItem>
            <image
              src="https://6578-examination-4a5460-1259638096.tcb.qcloud.la/img/2.jpg?sign=fbe75495cf7add454e2e528fbe81b913&t=1563608814"></image>
          </SwiperItem>
          <SwiperItem>
            <image
              mode="scaleToFill"
              src="https://6578-examination-4a5460-1259638096.tcb.qcloud.la/img/3.png?sign=f9f9b85dd27a43eb49a0549a6f5eceb2&t=1563608735"></image>
          </SwiperItem>
        </Swiper>
        {msg && <View class="marjor_notice">
          <AtNoticebar style="background:#13ce66;color:#fff;" icon="bell">{msg}</AtNoticebar>
        </View>}
        {isVerify
          ? this.renderVerifyGroup()
          : this.renderNoVerifyGroup()}

        {showLoginBtn && <View style="text-align:center;">
          <Button
            type="primary"
            size="mini"
            open-type="getUserInfo"
            onGetUserInfo={this.getUserInfo}>
            点击登录
          </Button>
        </View>
}
        <View style="text-align:center;">
          <Input
            type='text'
            placeholder='接口名称，如auth/accounts/self'
            value={url}
            onChange={this
            .onUrlHandle
            .bind(this)}
            style="border:1px solid #dbdbdb;width:90%;height:32px;"/>
          <Input
            type='text'
            placeholder='请求方式'
            value={method}
            onChange={this
            .onMethodHandle
            .bind(this)}
            style="border:1px solid #dbdbdb;width:90%;margin:10PX 0; height:32px; "/>
          <Input
            type='text'
            placeholder="参数，如name:1,job:ccc"
            value={param}
            onChange={this
            .onParamHanle
            .bind(this)}
            style="border:1px solid #dbdbdb; width:90%;height:32px; "/>
          <Button
            style="margin-top:10px;"
            type="primary"
            size="mini"
            onClick={this
            .testInterface
            .bind(this)}>
            调试接口
          </Button>
        </View>

        {/* <View class="adv_wrap">广告位</View> */}
      </View>
    );

  }

  private renderNoVerifyGroup() {
    return <View class="btn_group">
      <View
        class="btn_item"
        style="background-color: #409eff;"
        onClick={this.noVerifyHandle}>模拟考试</View>
      <View
        class="btn_item"
        style="background-color: #5daf34;"
        onClick={this.noVerifyHandle}>真题解析</View>
      <View
        class="btn_item"
        style="background-color: #e6a23c;"
        onClick={this.noVerifyHandle}>错题集</View>
      <View
        class="btn_item"
        style="background-color: #07c160;"
        onClick={this.noVerifyHandle}>收藏</View>
    </View>
  }
  private noVerifyHandle() {
    Taro.showToast({title: "您还未通过审核，请联系管理员。", icon: "none"});
  }
  private renderVerifyGroup() {
    let {
      courses = [],
      course
    } = this.state;

    return <View class="btn_group">
      <Picker
        class="btn_item"
        style="background-color: #409eff;"
        value={course}
        mode='selector'
        range={courses.map(item => item.course_name)}
        onChange={this
        .enterExamHandle
        .bind(this)}>模拟考试</Picker>
      <Picker
        class="btn_item"
        style="background-color: #5daf34;"
        value={course}
        mode='selector'
        range={courses.map(item => item.course_name)}
        onChange={this
        .enterExamHandle
        .bind(this)}>真题解析</Picker>
      <Picker
        class="btn_item"
        style="background-color: #e6a23c;"
        value={course}
        mode='selector'
        range={courses.map(item => item.course_name)}
        onChange={this
        .enterErrorHandle
        .bind(this)}>错题集</Picker>
      <Picker
        class="btn_item"
        value={course}
        mode='selector'
        range={courses.map(item => item.course_name)}
        onChange={this
        .enterFavorHandle
        .bind(this)}
        style="background-color: #07c160;">收藏</Picker>
    </View>
  }

  private getUserInfo(data) {
    console.log("getUserInfo", data);
    let {encryptedData, iv} = data.detail;
    //重新走一遍注册登录
    goLogin(encryptedData, iv).then(res => {
      getLoginToken(encryptedData, iv).then(this.pullHandle.bind(this));
    });
  }

  private enterExamHandle(e) {
    let idx = e.detail.value;
    let course = this.state.courses[idx];
    if (course) {
      Taro.navigateTo({
        url: "../book/index?id=" + course.course_id
      });
    }
  }

  private enterFavorHandle(e) {
    let idx = e.detail.value;
    let course = this.state.courses[idx];
    console.log("enterFavorHandle", course);
    if (course) {
      Taro.navigateTo({
        url: "../favor/index?name=" + course.course_name
      });
    }
  }

  private enterErrorHandle(e) {
    let idx = e.detail.value;
    let course = this.state.courses[idx];
    console.log("enterFavorHandle", course);
    if (course) {
      Taro.navigateTo({
        url: "../errorbook/index?id=" + course.course_id
      });
    }
  }

  private onUrlHandle(e) {
    console.log(e.detail.value);
    this.setState({url: e.detail.value});
  }
  private onMethodHandle(e) {
    console.log(e.detail.value);
    this.setState({method: e.detail.value});
  }
  private onParamHanle(e) {
    console.log(e.detail.value);
    this.setState({param: e.detail.value});
  }

  private testInterface() {
    let {url, method, param} = this.state;
    if (!url) {
      Taro.showToast({title: "url 不合法"});
      return;
    }
    let list = param.split(",");
    let obj = {}
    list.forEach(element => {
      let list = element.split(/：|:/);
      obj[list[0]] = list[1];
    });
    console.log(obj);
    sendRequest(method, "http://kobejia.club:7778/" + url, obj).then(data => {
      console.log(data);
    });
  }
}
