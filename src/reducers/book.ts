import {Fetch} from '../constants/book'

const INITIAL_STATE = {
  list: null
}

export default function book(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Fetch:
      return {
        ...state,
        list: action.payload
      }
    default:
      return state
  }
}
