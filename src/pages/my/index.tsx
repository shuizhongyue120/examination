import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Text, Image} from '@tarojs/components'
import {AtList, AtListItem} from "taro-ui"
import {connect} from '@tarojs/redux'

import {fetchInfo, isLogin, loginOut} from "../../actions/user"
import {goLogin, getLoginToken} from "../../function/user"

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
    logined: false
  }
}
type PageDispatchProps = {
  fetchInfo: () => any;
  loginOut:()=>any;
  isLogin: () => any;
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
  loginOut() {
    dispatch(loginOut());
  }
}))
class Index extends Component < IProps,
any > {
  private timer = 0;
  constructor(props, context) {
    super(props, context);
    this.state = {
      showLoginBtn: !Taro.getStorageSync("access_token"),
      info: null
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
    navigationBarTitleText: '个人中心'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
    let {logined, info} = this.props.user;
    let nextLogined = nextProps.user.logined;
    this.setState({
      showLoginBtn: !nextLogined
    });
    if(!nextLogined){
      this.setState({
        showLoginBtn: true
      });
      return;
    }
    if (!logined && nextLogined && !info) {
      this
        .props
        .fetchInfo();
        return;
    }

    this.setState({info: nextProps.user.info});
  }
  componentDidMount() {}

  pullHandle() {
    this.timer = setInterval(() => {
      if ("1" === Taro.getStorageSync("loginover")) {
        this
          .props
          .isLogin();
        clearInterval(this.timer);
      }
      console.log("3333");
    }, 100)
  }

  componentWillUnmount() {}

  componentDidShow() {
    console.log(this.props);
    let {
      logined,
      info = {}
    } = this.props.user;
    this.setState({
      showLoginBtn: !logined,
      info
    });
  }

  componentDidHide() {}

  render() {
    let {
      showLoginBtn,
      info = {}
    } = this.state;
    let major = "暂无";
    if (info) {
      info = info || {};
      major = info.category_name + " ● " + info.major_name;
    }
    return (
      <View className='index'>
        <View class="info_wrap" style="">
          <Image src={info.avatar} class="avatar"></Image>
          <View style="margin-top:10px;">
            <Text>{info.nickname}</Text>
          </View>
        </View>

        <View class="list_wrap">
          <AtList>
            <AtListItem
              title='专业'
              note={major}
              arrow='right'
              onClick={this.majorHandle}
              thumb='https://6578-examination-4a5460-1259638096.tcb.qcloud.la/icon/222.png?sign=c29d0741b7d3b72497f327a76ff29cca&t=1564217706'/>
          </AtList>
        </View>
        <View style="text-align:center;margin-top:20PX">
          {showLoginBtn
            ? <Button type="primary" open-type="getUserInfo" onGetUserInfo={this.getUserInfo}
            style="width:70vw;">
                登录
              </Button>
            : <Button
              onClick={this
              .loginOutHandle
              .bind(this)}
              style="width:70vw;">
              退出登录
            </Button>
}
        </View>
      </View>
    )
  }

  private getUserInfo(data) {
    console.log("getUserInfo", data);
    let {encryptedData, iv} = data.detail;
    goLogin(encryptedData, iv).then(res => {
      getLoginToken(encryptedData, iv).then(this.pullHandle.bind(this));
    });
  }

  private majorHandle() {
    Taro.showToast({title: "Test选择专业"});
  }

  private loginOutHandle() {
    this.setState({showLoginBtn: true, info: null});
    this.props.loginOut();
   // 
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
