import {Fetch, Unfavor} from '../constants/favor'

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

// 异步的action
export function unfavor(id) {
  return dispatch => {
    setTimeout(() => {
      dispatch({type: Unfavor, payload: id})
    }, 300);
  }
}
