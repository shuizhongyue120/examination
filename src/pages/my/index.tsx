import {ComponentClass} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Text, Image} from '@tarojs/components'
import {AtList, AtListItem} from "taro-ui"
import {connect} from '@tarojs/redux'

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

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  showLoginBtn?: boolean;
  userInfo: {
    nickName?: string,
    avatarUrl?: string
  }
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props : IProps;
}

@connect(({counter}) => ({counter}), (dispatch) => ({}))
class Index extends Component < IProps,
PageState > {

  constructor(props, context) {
    super(props, context);
    this.state = {
      showLoginBtn: Taro.getStorageSync("userenable") !== "1",
      userInfo: {
        nickName: "",
        avatarUrl: ""
      }
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
  }
  componentDidMount() {
    /*Taro
      .getUserInfo()
      .then(data => {
        console.log("componentDidMount", data);
        let {nickName, avatarUrl} = data.userInfo;
        this.setState({
          userInfo: {
            nickName,
            avatarUrl
          }

        })
      })*/
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    let {showLoginBtn, userInfo} = this.state;
    return (
      <View className='index'>
        <View class="info_wrap" style="">
          <Image src={userInfo.avatarUrl} class="avatar"></Image>
          <View style="margin-top:10px;">
            <Text>{userInfo.nickName}</Text>
          </View>
        </View>
        {showLoginBtn && <View style="text-align:center;">
          <Button
            type="primary"
            size="mini"
            open-type="getUserInfo"
            onGetUserInfo={this.getUserInfo}>
            点击授权
          </Button>
        </View>
}
        <View class="list_wrap">
          <AtList>
            <AtListItem
              title='专业选择'
              arrow='right'
              onClick={this.majorHandle}
              thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'/>
            <AtListItem
              title='关于XX'
              note='描述信息'
              onClick={this.MoreHandle}
              arrow='right'
              thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'/>
          </AtList>
        </View>

        <View>
          <Button
            type="primary"
            size="mini"
            open-type="getPhoneNumber"
            onGetPhoneNumber={this.getPhoneNumber}>
            获取手机号
          </Button>
        </View>

        <View>
          <Text>Hello, World</Text>
        </View>
      </View>
    )
  }

  private getUserInfo(data) {
    console.log("getUserInfo", data);
  }
  private majorHandle() {
    Taro.showToast({title: "Test选择专业"});
  }

  private MoreHandle() {
    Taro.showToast({title: "Test哈哈哈哈"});
  }
  private getPhoneNumber(data) {
    console.log(data);
    Taro.showToast({title: JSON.stringify(data)});
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
