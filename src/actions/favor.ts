import Taro from '@tarojs/taro'
import {Fetch} from '../constants/favor'

import {favorList} from "../function/api"


// 异步的action
export function fetch() {
  return dispatch => {
    favorList().then(({
      data = null
    }) => {
      dispatch({type: Fetch, payload: data})
    })
  }
}
