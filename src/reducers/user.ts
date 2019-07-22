import {Login, UserInfo, Courses} from '../constants/user'

const INITIAL_STATE = {
  logined: false,
  info: null,
  courses: null
}

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Login:
      return {
        ...state,
        logined: action.payload
      }
    case Courses:
      return {
        ...state,
        courses: action.payload
      }
    case UserInfo:
      return {
        ...state,
        info: action.payload
      }
    default:
      return state
  }
}
