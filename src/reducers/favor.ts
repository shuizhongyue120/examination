import {Fetch, Unfavor} from '../constants/favor'

const INITIAL_STATE = {
  list: null
}

export default function favor(state = INITIAL_STATE, action) {
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
