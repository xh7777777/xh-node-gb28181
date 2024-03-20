import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter/slice'
import userReducer from './counter/userSlice'

export * from './counter/userSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    userInfo: userReducer,
  }
})