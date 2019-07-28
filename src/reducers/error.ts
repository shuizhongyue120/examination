import {Fetch} from '../constants/error'

const INITIAL_STATE = {
  list: null
}

export default function error(state = INITIAL_STATE, action) {
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
