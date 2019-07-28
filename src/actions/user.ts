import Taro from '@tarojs/taro'
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
      } else {
        dispatch({type: UserInfo, payload: undefined});
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
      } else {
        dispatch({type: Courses, payload: undefined});
      }
    })
  }
}