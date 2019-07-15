import {FetchPapers} from '../constants/paper'

const INITIAL_STATE = {
  list: []
}

export default function book(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FetchPapers:
      return {
        ...state,
        list: action.payload
      }
    default:
      return state
  }
}
