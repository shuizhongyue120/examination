import {Fetch, FetchPapers, Submit} from '../constants/paper'

import {IQuestionItem} from "../constants/paper"

//试卷内容

export const fetch = (list) => {
  return {type: Fetch, payload: list}
}

export const fetchPapers = (list) => {
  return {type: FetchPapers, payload: list}
}

export const submit = () => {
  return {type: Submit}
}

let list : IQuestionItem[] = [
  {
    id: 1,
    name: "最喜欢的球星",
    chooses: [
      "A.科比", " B.梅西", " C.费德勒 ", "D.林丹"
    ],
    hasStar: false,
    answer: 1
  }, {
    id: 2,
    name: "最热爱的运动",
    chooses: [
      "A.篮球", " B.足球", " C.网球 ", "D.羽毛球"
    ],
    hasStar: true,
    answer: 1
  }, {
    id: 3,
    name: "最热爱的运动2",
    chooses: [
      "A.篮球", " B.足球", " C.网球 ", "D.羽毛球"
    ],
    hasStar: false,
    answer: 1
  }
]

// 异步的action
export function asyncFetch() {
  return dispatch => {
    setTimeout(() => {
      dispatch(fetch(list))
    }, 300);
  }
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