import '@tarojs/async-await'
import Taro, {Component, Config} from '@tarojs/taro'
import {Provider} from '@tarojs/redux'

import Index from './pages/index'
import {getLoginUrl} from "./constants";

import {sendRequest} from "./function/request";

import configStore from './store'

import './app.css'

// 如果需要在 h5 环境中开启 React Devtools 取消以下注释： if (process.env.NODE_ENV !==
// 'production' && process.env.TARO_ENV === 'h5')  {   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config : Config = {
    pages: [
      'pages/index/index', "pages/book/index", "pages/paper/index", 'pages/my/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      backgroundColor: "#f5f5f5",
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      backgroundColor: "#fefefe",
      list: [
        {
          text: "首页",
          pagePath: "pages/index/index",
          iconPath: "static/icon/home.png",
          selectedIconPath: "static/icon/home_act.png"
        }, {
          text: "我的",
          pagePath: "pages/my/index",
          iconPath: "static/icon/user.png",
          selectedIconPath: "static/icon/user_act.png"
        }
      ]
    }
  }

  componentDidMount() {
    this.loginAndRegister();
  }

  componentDidShow() {
    //this.loginAndRegister();
  }

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index/>
      </Provider>
    )
  }

  private loginAndRegister() {
    Taro
      .getSetting({})
      .then(res => {
        if (!res.authSetting['scope.userInfo']) {
          Taro.setStorage({key: "userenable", data: "0"});
          Taro
            .authorize({scope: 'scope.userInfo'})
            .then(data => {
              console.log("authorize", data);
            })
        } else {
          //已经授权
          Taro
            .getUserInfo()
            .then(res => {
              // console.log("getUserInfo", res);
              let {encryptedData, iv} = res;
              Taro
                .login()
                .then(res2 => {
                  //console.log(res2);
                  sendRequest("POST", getLoginUrl(), {
                    code: res2.code,
                    username: encryptedData,
                    password: iv
                  }).then(data => {
                    console.log("login msg:", data);
                  })
                });
            });
          Taro.setStorage({key: "userenable", data: "1"});
        }
      })
  }
}

Taro.render(
  <App/>, document.getElementById('app'))
