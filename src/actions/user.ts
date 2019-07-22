import Taro from '@tarojs/taro'
import {Login, UserInfo, Courses} from '../constants/user'
import {fetchUserInfo, fetchUserCourses} from '../function/user'

export const login = (list) => {
  return {type: Login, payload: list}
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
    fetchUserInfo().then(({
      data = null
    }) => {
      dispatch({type: UserInfo, payload:data})
    })
  }
}

// 异步的action
export function fetchCourses() {
  return dispatch => {
    fetchUserCourses().then(({
      data = null
    }) => {
      dispatch({type: Courses, payload:data})
    })
  }
}