import Taro from '@tarojs/taro'
import {error401Msg2code} from '../constants/index'
import {Fetch, Submit} from '../constants/paper'

import {fetchPapers} from "../function/api"

export const submit = () => {
  return {type: Submit}
}

// 异步的action
export function fetch(id, category) {
  return dispatch => {
    fetchPapers({course_id: id, subject_category: category}).then(res => {
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
