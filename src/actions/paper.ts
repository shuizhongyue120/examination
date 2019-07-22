import {Fetch, Favor, Submit} from '../constants/paper'

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
      dispatch({type: Fetch, payload: data})
    })
  }
}

// 异步的action
export function favor(id) {
  return dispatch => {
    setTimeout(() => {
      dispatch({type: Favor, payload: id})
    }, 300);
  }
}
