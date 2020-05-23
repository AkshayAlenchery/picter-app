import React, { createContext, useReducer } from 'react'
import {
  ADD_POST,
  SET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  ADD_COMMENT,
  SET_COMMENTS,
  DELETE_COMMENT,
  DELETE_POST,
  RESET
} from './actionTypes'
import { deleteKey } from '../helpers/context'

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
    case RESET:
      return initialState
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
    case ADD_COMMENT:
      return {
        posts: {
          contents: {
            ...state.posts.contents,
            [payload.data.postId]: {
              ...state.posts.contents[payload.data.postId],
              comments: payload.data.comments,
              commentIds: [
                ...state.posts.contents[payload.data.postId].commentIds,
                ...payload.data.comment_ids
              ]
            }
          },
          ids: [...state.posts.ids]
        },
        users: { ...state.users, ...payload.data.user },
        comments: { ...state.comments, ...payload.data.comment }
      }
    case SET_COMMENTS:
      return {
        posts: {
          contents: {
            ...state.posts.contents,
            [payload.data.postId]: {
              ...state.posts.contents[payload.data.postId],
              commentIds: [
                ...payload.data.commentIds,
                ...state.posts.contents[payload.data.postId].commentIds
              ]
            }
          },
          ids: [...state.posts.ids]
        },
        comments: { ...state.comments, ...payload.data.comments },
        users: { ...state.users, ...payload.data.users }
      }

    case DELETE_COMMENT:
      return {
        posts: {
          ...state.posts,
          contents: {
            ...state.posts.contents,
            [payload.data.postId]: {
              ...state.posts.contents[payload.data.postId],
              comments: payload.data.comments,
              commentIds: state.posts.contents[payload.data.postId].commentIds.filter(
                (id) => id !== payload.data.commentId
              )
            }
          }
        },
        users: { ...state.users },
        comments: deleteKey([payload.data.commentId], state.comments)
      }

    case DELETE_POST:
      return {
        posts: {
          contents: deleteKey([payload.data.postId], state.posts.contents),
          ids: state.posts.ids.filter((id) => id !== payload.data.postId)
        },
        users: { ...state.users },
        comments: deleteKey(state.posts.contents[payload.data.postId].commentIds, state.comments)
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
