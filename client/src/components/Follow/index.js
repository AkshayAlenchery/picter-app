import React, { useContext, Profiler } from 'react'
import Axios from 'axios'
import { Link, useRouteMatch } from 'react-router-dom'
import { v1 as genId } from 'uuid'

import { BASE_URL } from '../../config'
import './style.css'

import { ADD_NOTI } from '../../context/actionTypes'
import { Context as ProfileContext } from '../../context/Profile'
import { Context as NotificationContext } from '../../context/Notification'

export default ({ loggedInUser, userId, isFollowing, follow, unFollow }) => {
  const { url } = useRouteMatch()
  const { setProfile } = useContext(ProfileContext)
  const { setNotification } = useContext(NotificationContext)

  // Follow user
  const followUser = async () => {
    try {
      const resp = await Axios({
        method: 'POST',
        url: `${BASE_URL}/user/follow`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          followedUser: userId
        }
      })
      follow(resp.data)
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Couldnot follow user. Please try again later',
          type: 'error',
          color: 'red'
        }
      })
    }
  }

  // Follow user
  const unFollowUser = async () => {
    try {
      const resp = await Axios({
        method: 'DELETE',
        url: `${BASE_URL}/user/unfollow/${isFollowing}`
      })
      unFollow(resp.data)
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Couldnot unfollow user. Please try again later',
          type: 'error',
          color: 'red'
        }
      })
    }
  }

  if (loggedInUser === userId) {
    return (
      <Link to={`${url}/edit`} className='edit-user'>
        Edit details
      </Link>
    )
  }
  if (isFollowing) {
    return (
      <button onClick={unFollowUser} className='following'>
        <span>Following</span>
      </button>
    )
  }
  return (
    <button onClick={followUser} className='follow'>
      <span>Follow</span>
    </button>
  )
}
