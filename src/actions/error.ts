import Taro from '@tarojs/taro'
import {error401Msg2code} from '../constants/index'
import {Fetch, FetchErrorBook} from '../constants/error'

import {fetchErrorList} from "../function/api"

// 异步的action
export function fetch(id) {
  return dispatch => {
    fetchErrorList(id).then(res => {
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
    }).catch((res) => {
      Taro.setStorageSync("loginover", 1);
      Taro.showToast({
        title: "请求异常，" + res.errMsg,
        icon: "none"
      });
    })
  }
}

// 异步的action
export function fetchErrorBook(id) {
  return dispatch => {
    fetchErrorList(id).then(res => {
      if (200 == res.statusCode) {
        dispatch({
          type: FetchErrorBook,
          payload: res
            .data
            .map(item => item.subject_category)
        })
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
          title: "操作异常：" + res.statusCode
        })
      } else {
        Taro.setStorageSync("loginover", 1);
        dispatch({type: Fetch, payload: undefined});
        Taro.showToast({
          title: "操作异常：" + res.statusCode,
          icon: "none"
        })
      }

    }).catch((res) => {
      Taro.setStorageSync("loginover", 1);
      Taro.showToast({
        title: "请求异常，" + res.errMsg,
        icon: "none"
      });
    })
  }
}
