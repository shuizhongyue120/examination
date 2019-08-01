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
  loginOut: () => any;
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
  private ts = 0;
  private codeTxt = {
    "0": "empty",
    "-1": "授权登录",
    "201": "退出登录",
    "4010": "一键注册",
    "4011": "重新登录",
    "4012": "重新登录",
    "1": "重新登录",
    "404": "一键注册"
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      code: "0",
      info: undefined
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
    let nextInfo = nextProps.user.info;
    if (nextInfo) {
      this.ts = new Date().getTime();
      this.setState({info: nextProps.user.info});
      return;
    } else {
      this.setState({info: undefined, code: 0});
      this.pullHandle();
    }

  }
  componentDidMount() {}

  pullHandle() {
    this.timer = setInterval(() => {
      let loginover = Taro.getStorageSync("loginover");
      if (loginover == 201) {
        this
          .props
          .fetchInfo();
        clearInterval(this.timer);
        this.setState({code: loginover, info: undefined});
        return;
      }
      if (loginover != 0) {
        clearInterval(this.timer);
        this.setState({code: loginover, info: undefined});
        return;
      }
    }, 50)
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidShow() {
    this.pullHandle(); 
  }

  componentDidHide() {}

  render() {
    let {
      code,
      info = {}
    } = this.state;

    let {
      category_name = "暂无",
      major_name = "暂无",
      nickname = "未知",
      avatar
    } = info;
    let major = category_name + " ● " + major_name;
    avatar = avatar || "https://6578-examination-4a5460-1259638096.tcb.qcloud.la/img/default.jpeg?sign=3" +
      "c08d0764e6b1e93598f3860ee8fddb4&t=1564321663";
    return (
      <View className='my'>
        <View class="info_wrap">
          <Image src={avatar} class="avatar"></Image>
          <View style="margin-top:10px;">
            <Text>{nickname}</Text>
          </View>
        </View>

        <View class="list_wrap">
          <AtList>
            <AtListItem
              title='专业'
              note={major}
              arrow='right'
              onClick={this
              .majorHandle
              .bind(this)}
              thumb='https://6578-examination-4a5460-1259638096.tcb.qcloud.la/icon/hat.png?sign=34148c0757a14b6c284fd5c9f53a8607&t=1564648458'/>
            <AtListItem
              title='说明'
              note={"待完善....."}
              arrow='right'
              thumb='https://6578-examination-4a5460-1259638096.tcb.qcloud.la/icon/desc.png?sign=e4d582d2e39738cac1660eaf9e5e33f8&t=1564650091'/>
            <AtListItem
              title='待补充2'
              note={"待完善....."}
              arrow='right'
              thumb='https://6578-examination-4a5460-1259638096.tcb.qcloud.la/icon/222.png?sign=c29d0741b7d3b72497f327a76ff29cca&t=1564217706'/>
          </AtList>
        </View>
        <View style="text-align:center;margin-top:20PX">
          {-1 == code && <Button
            open-type="getUserInfo"
            onGetUserInfo={this.getUserInfo}>
            授权登录
          </Button>
}
          {(4010 == code || 404 == code) && <Button
            open-type="getUserInfo"
            onGetUserInfo={this.getUserInfo}>
            一键登录
          </Button>
}
          {(4011 == code || 4012 == code || 1 == code) && <Button
            open-type="getUserInfo"
            onGetUserInfo={this
            .loginHandle
            .bind(this)}>
            重新登录
          </Button>
}
          {201 == code && <Button
            onClick={this
            .loginOutHandle
            .bind(this)}>
            退出登录
          </Button>
}
        </View>
      </View>
    )
  }

  private getUserInfo(data) {
    let {encryptedData, iv} = data.detail;
    goLogin(encryptedData, iv).then(res => {
      getLoginToken(encryptedData, iv).then(this.pullHandle.bind(this));
    });
  }

  private majorHandle() {
    const {
      category_name = "暂无",
      major_name = "暂无"
    } = this.state.info || {};
    Taro.showToast({
      title: "您的考试类型为 " + category_name + "，专业为 " + major_name + "；如需更改，请联系管理员。",
      icon: "none"
    });
  }

  private loginOutHandle() {
    this.setState({code: "1", info: null});
    this
      .props
      .loginOut();

  }
  private loginHandle(data) {
    let {encryptedData, iv} = data.detail;
    getLoginToken(encryptedData, iv).then(this.pullHandle.bind(this));
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
