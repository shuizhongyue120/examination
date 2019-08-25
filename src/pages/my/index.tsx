import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Text, Image} from '@tarojs/components'
import {AtList, AtListItem} from "taro-ui"
import {connect} from '@tarojs/redux'

import {fetchInfo, isLogin, loginOut} from "../../actions/user"
import {goLogin, getLoginToken, fetchUserInfo} from "../../function/user"
import {getUserInfo, setUserInfo, getLoginCode, setLoginCode} from "../../global";
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
    info: undefined,
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

  constructor(props, context) {
    super(props, context);
    this.state = {
      code: 0,
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
    navigationBarTitleText: '我的'
  }

  componentDidMount() {}

  pullHandle() {
    this.timer = setInterval(() => {
      let loginCode = getLoginCode();
      let info = getUserInfo();
      if (loginCode == 201 || 403 === loginCode && info) {
          clearInterval(this.timer);
          this.setState({code: loginCode, info});
          return;
        
      }else {
        if (loginCode != 0 && loginCode != 200) {
          clearInterval(this.timer);
          this.setState({code: loginCode, info: undefined});
          return;
        }
      }

      
    }, 200)
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
      major_name = "暂无",
      nickname = "未知",
      major_id = 0,
      avatar
    } = info;
    let major = major_id === -1
      ? "未通过审核"
      : major_name;
    //let major = category_name + " ● " + major_name;
    avatar = avatar || "https://6578-examination-4a5460-1259638096.tcb.qcloud.la/img/default.jpeg?sign=3" +
      "c08d0764e6b1e93598f3860ee8fddb4&t=1564321663";
    nickname = -1 === code
      ? "未授权"
      : nickname;

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
              title='提示'
              note="注册成功后，需后台管理员审核通过后才能正常使用该小程序，如有疑问请联系管理员。"
              extraText=""
              thumb='https://6578-examination-4a5460-1259638096.tcb.qcloud.la/icon/desc.png?sign=e4d582d2e39738cac1660eaf9e5e33f8&t=1564650091'/>
          </AtList>
        </View>
        <View style="text-align:center;margin-top:20PX">
          {-1 === code && <Button open-type="getUserInfo" onGetUserInfo={this.getUserInfo}>
            授权登录
          </Button>
}
          {(4010 === code || 404 === code || 500===code) && <Button open-type="getUserInfo" onGetUserInfo={this.getUserInfo}>
            一键登录
          </Button>
}
          {(4011 === code || 4012 === code || 1 === code || 2010 === code) && <Button
            open-type="getUserInfo"
            onGetUserInfo={this
            .loginHandle
            .bind(this)}>
            重新登录
          </Button>
}
          {(201 === code || 403 === code) && <Button onClick={this
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
    //重新走一遍注册登录
    goLogin(encryptedData, iv).then(({
      statusCode,
      data = {}
    }) => {
      console.log("goLogin:", statusCode, data);
      if (201 === statusCode || (400 === statusCode && (data.error_code === "wxapp_already_registered"))) { //注册成功，或者已经注册
        getLoginToken(encryptedData, iv).then(isSuc => {
          this.setLoginAndInfo(getLoginCode());
          if (isSuc) {
            this.setLoginAndInfo(getLoginCode());
            fetchUserInfo().then(data => {
              if (200 === data.statusCode) {
                this.setLoginAndInfo(201, data.data);
                setUserInfo(data.data);
                return;
              }

              this.setLoginAndInfo(201, data.data);
            }).catch(() => {
              setUserInfo("");
              Taro.showToast({title: "读取用户信息失败，请重试", icon: "none"})
            })
          }else {
            //登录失败
          }
        });
      } else {
        setLoginCode(404);
        Taro.showToast({
          title: "操作失败，请重试：" + statusCode,
          icon: "none"
        })
      }

    });
  }

  private majorHandle() {
    let {
      code,
      info = {}
    } = this.state;
    const {
      major_name = "暂无",
      major_id = 0
    } = info;
    if (-1 === code) {
      Taro.showToast({title: "请授权登录", icon: "none"});
      return;
    }
    let tips = major_id === -1
      ? "未通过审核，请联系管理员。"
      : "您的专业为 " + major_name + "；如需更改，请联系管理员。";
    Taro.showToast({title: tips, icon: "none"});
  }

  private loginOutHandle() {
    this
      .props
      .loginOut();
      this.setState({code: 2010, info: undefined});

  }

  private setLoginAndInfo(code = -1, info?:any) {
    setLoginCode(code);
    this.setState({code, info});
  }

  private loginHandle(data) {
    let {encryptedData, iv} = data.detail;
    getLoginToken(encryptedData, iv).then(isSuc => {
      this.setLoginAndInfo(getLoginCode());
      if (isSuc) {
        fetchUserInfo().then(data => {
          if (200 === data.statusCode) {
            this.setLoginAndInfo(201, data.data);
            setUserInfo(data.data);
            return;
          }

          this.setLoginAndInfo(data.statusCode);
        }).catch(() => {
          setUserInfo("");
          Taro.showToast({title: "读取用户信息失败，请重试", icon: "none"})
        })
      }else {
        //token 失败
      }
    });
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
