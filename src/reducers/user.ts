import {Login, UserInfo, Courses, LoginOut} from '../constants/user'

const INITIAL_STATE = {
  logined: false,
  info: undefined,
  courses: undefined
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
    case LoginOut:
      return {
        ...state,
        logined: false,
        info:null
      }
    default:
      return state
  }
}
