import Taro from '@tarojs/taro'
import {error401Msg2code} from '../constants/index'
import {Login, LoginOut, UserInfo, Courses} from '../constants/user'
import {fetchUserInfo, fetchUserCourses} from '../function/user'

export const login = (list) => {
  return {type: Login, payload: list}
}

// 异步的action
export function loginOut() {
  return dispatch => {
    Taro.setStorageSync("loginover", "");
    Taro.setStorageSync("access_token", "");
    Taro.setStorageSync("account_id", "");
    dispatch({type: LoginOut})
  }
}

// 异步的action
export function isLogin() {
  return dispatch => {
    dispatch(login(!!Taro.getStorageSync("access_token")))
  }
}

// 异步的action
export function fetchInfo() {
  return dispatch => {
    fetchUserInfo().then(res => {
      if (200 == res.statusCode) {
        dispatch({type: UserInfo, payload: res.data})
      } else if (404 == res.statusCode || 403 == res.statusCode) {
        Taro.setStorageSync("loginover", res.statusCode);
        dispatch({type: UserInfo, payload: undefined});
      } else if (401 === res.statusCode) { //无效
        let code = error401Msg2code[res.data.error_code];
        Taro.setStorageSync("loginover", code);
        dispatch({type: UserInfo, payload: undefined});
      } else {
        Taro.setStorageSync("loginover", 1);
        dispatch({type: UserInfo, payload: undefined});
        Taro.showToast({title: "读取用户信息失败，请重试。"})
      }

    })
  }
}

// 异步的action
export function fetchCourses() {
  return dispatch => {
    fetchUserCourses().then(res => {
      if (200 == res.statusCode) {
        dispatch({type: Courses, payload: res.data})
      } else if (403 == res.statusCode) { //未审核通过
        dispatch({type: Courses, payload: undefined});
      } else if (404 == res.statusCode) {
        dispatch({type: Courses, payload: undefined});
      } else if (401 === res.statusCode) { //无效
        let code = error401Msg2code[res.data.error_code];
        Taro.setStorageSync("loginover", code);
        dispatch({type: Courses, payload: undefined});
      } else {
        Taro.setStorageSync("loginover", 1);
        dispatch({type: Courses, payload: undefined});
        Taro.showToast({title: "读取课程失败，请重试。"})
      }
    })
  }
}