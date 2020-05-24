import React, { createContext, useReducer } from 'react'

import { LOGIN_USER, LOGOUT_USER, UPDATE_AUTH_USER } from '../context/actionTypes'

const reducer = (state, payload) => {
  console.log(payload)
  switch (payload.action) {
    case LOGIN_USER:
      return Object.assign({}, state, { isAuth: true, user: payload.data })
    case LOGOUT_USER:
      return Object.assign({}, state, { isAuth: false, user: null })
    case UPDATE_AUTH_USER:
      return Object.assign({}, state, { user: payload.data })
    default:
      return state
  }
}

const initialState = {
  isAuth: false,
  user: null
}

export const Context = createContext()

export const Provider = (props) => {
  const [authUser, setAuthUser] = useReducer(reducer, initialState)
  return <Context.Provider value={{ authUser, setAuthUser }}>{props.children}</Context.Provider>
}
