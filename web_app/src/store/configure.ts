import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter/slice'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})