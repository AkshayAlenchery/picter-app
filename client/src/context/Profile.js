import React, { createContext, useReducer } from 'react'
import {
  SET_PROFILE,
  ADD_FOLLOWER,
  REMOVE_FOLLOWER,
  SET_FOLLOWERS,
  SET_FOLLOWING,
  UPDATE_PROFILE
} from './actionTypes'

// Initial state
const initialState = {
  user: {},
  followers: [],
  following: [],
  users: {}
}

// Reducer
const reducer = (state, payload) => {
  console.log(payload)
  switch (payload.action) {
    case SET_PROFILE:
      return {
        ...payload.data
      }
    case ADD_FOLLOWER:
      return {
        user: {
          ...state.user,
          ...payload.data.user
        },
        following: [...state.following],
        followers: [...payload.data.followers, ...state.followers],
        users: {
          ...state.users,
          ...payload.data.users
        }
      }
    case REMOVE_FOLLOWER:
      return {
        user: {
          ...state.user,
          isFollowing: payload.data.isFollowing,
          followers: payload.data.followers
        },
        followers: state.followers.filter((id) => id !== payload.data.unFollower),
        following: [...state.following],
        users: { ...state.users }
      }

    case SET_FOLLOWING:
      return {
        user: { ...state.user },
        followers: [...state.followers],
        following: [...payload.data.following],
        users: { ...state.users, ...payload.data.users }
      }
    case SET_FOLLOWERS:
      return {
        user: { ...state.user },
        following: [...state.following],
        followers: [...payload.data.followers],
        users: { ...state.users, ...payload.data.users }
      }
    case UPDATE_PROFILE:
      return {
        user: {
          ...state.user,
          ...payload.data
        },
        followers: [...state.followers],
        following: [...state.following],
        users: { ...state.users }
      }
    default:
      return state
  }
}

// Context
export const Context = createContext()

// Provider
export const Provider = ({ children }) => {
  const [profile, setProfile] = useReducer(reducer, initialState)
  return <Context.Provider value={{ profile, setProfile }}>{children}</Context.Provider>
}
