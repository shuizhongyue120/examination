import {Fetch} from '../constants/book'
import {fetchBookPapers} from '../function/api'


// 异步的action
export function fetchBooks(id) {
  return dispatch => {
    fetchBookPapers({course_id:id}).then(({
      data = null
    }) => {
      dispatch({
        type: Fetch, payload: data
      })
    })
  }
}