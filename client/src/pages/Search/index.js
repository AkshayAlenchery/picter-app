import React, { useEffect, useContext, useState } from 'react'
import Axios from 'axios'
import { v1 as genId } from 'uuid'

import Navbar from '../../components/Navbar'
import User from '../../components/Search'
import './style.css'
import { BASE_URL } from '../../config'
import ProfileNav from '../../components/Sidebar/profile'

import { Context as NotificationContext } from '../../context/Notification'
import { ADD_NOTI } from '../../context/actionTypes'

export default (props) => {
  // Notification context
  const { setNotification } = useContext(NotificationContext)
  // State for no more post
  const [loadMore, setLoadMore] = useState(true)
  const [search, setSearch] = useState([])

  // Search user
  const searchUser = async (event) => {
    if (!event.target.value) {
      setSearch([])
      return null
    }
    try {
      const resp = await Axios.get(`${BASE_URL}/user/search/${event.target.value}/0`)
      setSearch(resp.data)
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Could not search for user. Please try again later',
          type: 'error',
          color: 'red'
        }
      })
    }
  }

  return (
    <div>
      <Navbar />
      <div className='container'>
        <div className='main-contents'>
          <div className='contents'>
            <div className='search-container'>
              <input type='text' onKeyUp={searchUser} placeholder='Search user' />
              {search.length ? (
                search.map((user) => <User key={user.id} user={user} />)
              ) : (
                <p className='muted-text center'>No user found</p>
              )}
            </div>
          </div>
          <div className='sidebar'>
            <ProfileNav />
          </div>
        </div>
      </div>
    </div>
  )
}
