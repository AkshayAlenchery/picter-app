import React, { createContext, useReducer } from 'react'

const initialState = {
  posts: {
    contents: {},
    ids: {}
  },
  users: {},
  comments: {}
}

// Reducer
const reducer = (state, payload) => {
  switch (payload.action) {
    default:
      return state
  }
}

// Context for posts
export const Context = createContext()

// Post provider
export const Provider = (props) => {
  const [posts, setPost] = useReducer(reducer, initialState)
  return <Context.Provider>{props.children}</Context.Provider>
}
