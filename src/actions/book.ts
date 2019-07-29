import Taro from '@tarojs/taro'
import {Fetch} from '../constants/book'
import {fetchCategory} from '../function/api'


// 异步的action
export function fetchBooks(id) {
  return dispatch => {
    fetchCategory({course_id:id}).then(({
      data = null
    }) => {
      dispatch({
        type: Fetch, payload: data
      })
    }).catch((res)=>{
      Taro.setStorageSync("loginover", 1);
     Taro.showToast({title:"请求异常，" + res.errMsg});
    })
  }
}