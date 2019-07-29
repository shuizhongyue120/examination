
import Taro from '@tarojs/taro'
import {Fetch, Submit} from '../constants/paper'

import {fetchPapers} from "../function/api"

export const submit = () => {
  return {type: Submit}
}

// 异步的action
export function fetch(id, category) {
  return dispatch => {
    fetchPapers({course_id: id, subject_category: category}).then(({
      data = null
    }) => {
     /*  let list = data
        .concat(JSON.parse(JSON.stringify(data)))
        .concat(JSON.parse(JSON.stringify(data)));
      let res : any[] = [];
      list.forEach((item, index) => {
        list[index].subject_id = index +1;
        res.push(list[index]);
      }) */
      dispatch({type: Fetch, payload: data})
    }).catch((res)=>{
      Taro.setStorageSync("loginover", 1);
      Taro.showToast({title:"请求异常，" + res.errMsg});
     })
  }
}

