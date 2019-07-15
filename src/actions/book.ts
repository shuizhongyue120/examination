import {FetchPapers} from '../constants/paper'


export const fetchPapers = (list) => {
  return {type: FetchPapers, payload: list}
}

// 异步的action
export function asyncFetchPapers() {
  return dispatch => {
    setTimeout(() => {
      dispatch(fetchPapers([
        {
          id: 0,
          name: "语文模拟考试1"
        }, {
          id: 1,
          name: "语文模拟考试2"
        }
      ]))
    }, 300);
  }
}