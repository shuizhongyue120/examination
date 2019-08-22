import Taro from '@tarojs/taro'
import {error401Msg2code} from '../constants/index'
import {Fetch, FetchErrorBook} from '../constants/error'

import {fetchErrorList} from "../function/api"
import {setLoginCode} from "../global";
// 异步的action
export function fetch(id) {
  return dispatch => {
    fetchErrorList(id).then(res => {
      if (200 == res.statusCode) {
        dispatch({type: Fetch, payload: res.data || []});
      } else if (404 == res.statusCode || 403 == res.statusCode) {
        setLoginCode(res.statusCode);
        dispatch({type: Fetch, payload: undefined});
        Taro.showToast({
          title: "操作异常：" + res.statusCode,
          icon: "none"
        })
      } else if (401 === res.statusCode) { //无效
        let code = error401Msg2code[res.data.error_code];
        setLoginCode(code);
        dispatch({type: Fetch, payload: undefined});
        Taro.showToast({
          title: "操作异常：" + res.statusCode,
          icon: "none"
        })
      } else {
        setLoginCode(1);
        dispatch({type: Fetch, payload: undefined});
        Taro.showToast({
          title: "操作异常：" + res.statusCode,
          icon: "none"
        })
      }
    }).catch((res) => {
      //setLoginCode(500);
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
        setLoginCode(res.statusCode);
        dispatch({type: Fetch, payload: undefined});
        Taro.showToast({
          title: "操作异常：" + res.statusCode,
          icon: "none"
        })
      } else if (401 === res.statusCode) { //无效
        let code = error401Msg2code[res.data.error_code];
        setLoginCode(code);
        dispatch({type: Fetch, payload: undefined});
        Taro.showToast({
          title: "操作异常：" + res.statusCode
        })
      } else {
        setLoginCode(1);
        dispatch({type: Fetch, payload: undefined});
        Taro.showToast({
          title: "操作异常：" + res.statusCode,
          icon: "none"
        })
      }

    }).catch((res) => {
      setLoginCode(500);
      Taro.showToast({
        title: "请求异常，" + res.errMsg,
        icon: "none"
      });
    })
  }
}
