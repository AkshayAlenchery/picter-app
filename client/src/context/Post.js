import React, { createContext, useReducer } from 'react'
import { ADD_POST, SET_POSTS, LIKE_POST, UNLIKE_POST } from './actionTypes'

const initialState = {
  posts: {
    contents: {},
    ids: []
  },
  users: {},
  comments: {}
}

// Reducer
const reducer = (state, payload) => {
  console.log(payload)
  switch (payload.action) {
    case ADD_POST:
      return {
        posts: {
          contents: {
            ...state.posts.contents,
            ...payload.data.posts.contents
          },
          ids: [...payload.data.posts.ids, ...state.posts.ids]
        },
        users: {
          ...state.users,
          ...payload.data.users
        },
        comments: { ...state.comments, ...payload.data.comments }
      }
    case SET_POSTS:
      return {
        posts: {
          contents: {
            ...state.posts.contents,
            ...payload.data.posts.contents
          },
          ids: [...state.posts.ids, ...payload.data.posts.ids]
        },
        users: {
          ...state.users,
          ...payload.data.users
        },
        comments: { ...state.comments, ...payload.data.comments }
      }
    case LIKE_POST:
    case UNLIKE_POST:
      return {
        posts: {
          ...state.posts,
          contents: {
            ...state.posts.contents,
            [payload.data.postId]: {
              ...state.posts.contents[payload.data.postId],
              likes: payload.data.likes,
              liked: payload.data.liked
            }
          },
          ids: [...state.posts.ids]
        },
        users: { ...state.users },
        comments: { ...state.comments }
      }
    default:
      return state
  }
}

// Context for posts
export const Context = createContext()

// Post provider
export const Provider = (props) => {
  const [posts, setPost] = useReducer(reducer, initialState)
  return <Context.Provider value={{ posts, setPost }}>{props.children}</Context.Provider>
}
