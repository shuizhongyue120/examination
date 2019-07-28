import {Fetch, FetchErrorBook} from '../constants/error'

import {fetchErrorList} from "../function/api"


// 异步的action
export function fetch(id) {
  return dispatch => {
    fetchErrorList(id).then(({
      data = null
    }) => {
      dispatch({type: Fetch, payload: data})
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
    })
  }
}

