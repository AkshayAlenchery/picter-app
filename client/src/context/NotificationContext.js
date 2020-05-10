import React, { createContext, useReducer } from 'react'
import { ADD_NOTI, REMOVE_NOTI } from './actionTypes'

// Initial state
const initialState = []

// Notification reducer
const reducer = (state, payload) => {
  switch (payload.action) {
    case ADD_NOTI:
      return [payload.data, ...state]
    case REMOVE_NOTI:
      return state.filter((noti) => noti.id !== payload.data)
    default:
      return state
  }
}

// Notification context
export const Context = createContext()

// Notification Provider
export const Provider = (props) => {
  const [notifications, setNotification] = useReducer(reducer, initialState)
  return (
    <Context.Provider value={{ notifications, setNotification }}>{props.children}</Context.Provider>
  )
}
