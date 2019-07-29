import Taro from '@tarojs/taro'
import {Fetch, FetchErrorBook} from '../constants/error'

import {fetchErrorList} from "../function/api"


// 异步的action
export function fetch(id) {
  return dispatch => {
    fetchErrorList(id).then(({
      data = null
    }) => {
      dispatch({type: Fetch, payload: data})
    }).catch((res)=>{
      Taro.setStorageSync("loginover", 1);
      Taro.showToast({title:"请求异常，" + res.errMsg});
     })
  }
}

// 异步的action
export function fetchErrorBook(id) {
  return dispatch => {
    fetchErrorList(id).then(({
      data = []
    }) => {
      dispatch({type: FetchErrorBook, payload: data.map(item=>item.subject_category)})
    }).catch((res)=>{
      Taro.setStorageSync("loginover", 1);
      Taro.showToast({title:"请求异常，" + res.errMsg});
     })
  }
}

