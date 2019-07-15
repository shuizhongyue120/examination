import {Fetch, Submit, FetchPapers} from '../constants/paper'

const INITIAL_STATE = {
  list: [],
  sublist: []
}

export default function paper(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Fetch:
      return {
        ...state,
        list: action.payload
      }
    case FetchPapers:
      return {
        ...state,
        list: action.payload
      }
    case Submit:
      return {
        ...state,
        list: action.payload
      }
    default:
      return state
  }
}
