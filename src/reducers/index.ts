import {combineReducers} from 'redux'
import book from './book'
import paper from './paper'
import user from './user'
import favor from './favor'

export default combineReducers({paper, book, user, favor})
