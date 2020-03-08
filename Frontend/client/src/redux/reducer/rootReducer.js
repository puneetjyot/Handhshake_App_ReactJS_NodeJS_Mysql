import authReducer from './authReducer';
import projectReducer from './projectReducer';
import profileReducer from './profileReducer'
import { combineReducers } from 'redux'

const rootReducer=combineReducers({
    auth:authReducer,
    project:projectReducer,
    profileReducer:profileReducer
})

export default rootReducer;