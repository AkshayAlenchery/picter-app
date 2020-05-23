import React, { useContext, useEffect } from 'react'
import { v1 as genId } from 'uuid'
import Axios from 'axios'

import './style.css'
import { BASE_URL } from '../../config'
import User from '../../components/User'
import { Card, CardHeader, CardTitle, CardBody } from '../../assets/css/styled-css'

import { Context as ProfileContext } from '../../context/Profile'
import { Context as NotificationContext } from '../../context/Notification'
import { ADD_NOTI, SET_FOLLOWING } from '../../context/actionTypes'

export default (props) => {
  const { profile, setProfile } = useContext(ProfileContext)
  const { setNotification } = useContext(NotificationContext)

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const resp = await Axios({
          method: 'POST',
          url: `${BASE_URL}/user/following/${profile.user.id}`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            current: 0
          }
        })
        setProfile({
          action: SET_FOLLOWING,
          data: resp.data
        })
      } catch (err) {
        setNotification({
          action: ADD_NOTI,
          data: {
            id: genId(),
            message: 'There was an error while loading people you follow. Please try again later',
            type: 'error',
            color: 'red'
          }
        })
      }
    }
    fetchFollowing()
  }, [profile.user.id])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Following - {profile.user.following}</CardTitle>
      </CardHeader>
      <CardBody>
        {profile.following.length ? (
          profile.following.map((user) => {
            return <User key={user} user={profile.users[user]} />
          })
        ) : (
          <p className='muted-text center'>No following to show</p>
        )}
      </CardBody>
    </Card>
  )
}
