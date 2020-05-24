import React, { useState, useContext } from 'react'
import { Icon } from '../../assets/css/styled-css'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Link, Redirect } from 'react-router-dom'
import Axios from 'axios'
import { v1 as genId } from 'uuid'

import './style.css'
import Avatar from '../../assets/images/avatar.jpg'

import { Context as AuthContext } from '../../context/Auth'
import { Context as NotificationContext } from '../../context/Notification'
import { LOGOUT_USER, ADD_NOTI } from '../../context/actionTypes'

export default (props) => {
  const { authUser, setAuthUser } = useContext(AuthContext)
  const { setNotification } = useContext(NotificationContext)

  const [showDropdown, setDropdown] = useState(false)

  const logout = (event) => {
    event.preventDefault()
    document.cookie = 'x-auth-token= ; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    delete Axios.defaults.headers.common['x-auth-token']
    setAuthUser({
      action: LOGOUT_USER,
      payload: null
    })
    setNotification({
      action: ADD_NOTI,
      data: {
        id: genId(),
        type: 'success',
        message: 'Logged out successully.',
        color: 'green'
      }
    })
    return <Redirect to='/' />
  }

  return (
    <header className='header'>
      <div className='container'>
        <h1 className='logo'>Picter</h1>
        {!authUser.isAuth ? (
          ''
        ) : (
          <div className='dropdown'>
            <div className='dropdown-header' onClick={() => setDropdown(!showDropdown)}>
              <div className='dropdown-img'>
                <img src={authUser.user.avatar || Avatar} />
              </div>
              <p>{authUser.user.firstname}</p>
              <Icon icon={faAngleDown} />
            </div>
            {showDropdown ? (
              <div className='dropdown-list'>
                <ul>
                  <li>
                    <Link to={`/${authUser.user.username}`}>View profile</Link>
                  </li>
                  <li>
                    <Link to='/search'>Search</Link>
                  </li>
                  <li>
                    <Link to='/home'>Home</Link>
                  </li>
                  <li>
                    <a href='#' onClick={logout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              ''
            )}
          </div>
        )}
      </div>
    </header>
  )
}
