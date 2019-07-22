import { combineReducers } from 'redux'
import book from './book'
import paper from './paper'
import user from './user'

export default combineReducers({
  paper,book, user
})
