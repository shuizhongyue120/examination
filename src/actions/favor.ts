import Taro from '@tarojs/taro'
import {error401Msg2code} from '../constants/index'
import {Fetch} from '../constants/favor'

import {favorList} from "../function/api"

// 异步的action
export function fetch() {
  return dispatch => {
    favorList().then(res => {
      if (200 == res.statusCode) {
        dispatch({type: Fetch, payload: res.data});
      } else if (404 == res.statusCode || 403 == res.statusCode) {
        Taro.setStorageSync("loginover", res.statusCode);
        dispatch({type: Fetch, payload: undefined});
        Taro.showToast({
          title: "操作异常：" + res.statusCode,
          icon: "none"
        })
      } else if (401 === res.statusCode) { //无效
        let code = error401Msg2code[res.data.error_code];
        Taro.setStorageSync("loginover", code);
        dispatch({type: Fetch, payload: undefined});
        Taro.showToast({
          title: "操作异常：" + res.statusCode,
          icon: "none"
        })
      } else {
        Taro.setStorageSync("loginover", 1);
        dispatch({type: Fetch, payload: undefined});
        Taro.showToast({
          title: "操作异常：" + res.statusCode,
          icon: "none"
        })
      }

    })
  }
}
