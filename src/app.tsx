import '@tarojs/async-await'
import Taro, {Component, Config} from '@tarojs/taro'
import {Provider} from '@tarojs/redux'

import Index from './pages/index'
import {goLogin, getLoginToken, checkLogin} from "./function/user";
import configStore from './store'

import './app.css'
import "taro-ui/dist/weapp/css/index.css";
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
      'pages/index/index', "pages/book/index", "pages/paper/index", "pages/favor/index", 'pages/my/index'
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
      selectedColor:"#2747DE",
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
    //this.loginAndRegister();
  }

  componentDidShow() {
    this.loginAndRegister();
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

  private tokenHandle() {
    Taro
      .getUserInfo()
      .then(user => {
        let {encryptedData, iv} = user;
        getLoginToken(encryptedData, iv).then(()=>{
          Taro.setStorageSync("loginover","1");
        });
      })
  }

  private loginAndTokenHandle() {
    Taro
      .getUserInfo()
      .then(user => {
        let {encryptedData, iv} = user;
        goLogin(encryptedData, iv).then(() => {
          this.tokenHandle();
        });
      })
  }

  private loginAndRegister() {
    Taro.setStorageSync("loginover","0");
    Taro
      .getSetting({})
      .then(res => {
        if (!res.authSetting['scope.userInfo']) {
          Taro.setStorageSync("loginover","1");
          //未授权
        } else {

          if (checkLogin()) {
            Taro.setStorageSync("loginover","1");
           // this.tokenHandle();
          } else {
            this.loginAndTokenHandle();
          }
        }

      })
      .catch(data => {
        console.log("getSetting error", data);
      })
  }
}

Taro.render(
  <App/>, document.getElementById('app'))
