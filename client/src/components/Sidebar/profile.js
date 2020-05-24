import React, { useContext } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

import './style.css'
import Avatar from '../../assets/images/avatar.jpg'

import { Context as AuthContext } from '../../context/Auth'

export default () => {
  const { authUser } = useContext(AuthContext)
  const { url } = useRouteMatch()

  return (
    <div className='sidebar-nav-cont'>
      <div className='user-info'>
        <div className='user-pic'>
          <img src={authUser.user.avatar || Avatar} alt={authUser.user.username} />
        </div>
        <h1>
          {authUser.user.firstname} {authUser.user.lastname}
        </h1>
      </div>
      <div className='sidebar-nav' style={{ textAlign: 'center' }}>
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
        </ul>
      </div>
    </div>
  )
}
