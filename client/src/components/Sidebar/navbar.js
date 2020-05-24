import React, { useContext } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

import { Context as ProfileContext } from '../../context/Profile'

import './style.css'

export default () => {
  const { profile } = useContext(ProfileContext)
  const { url } = useRouteMatch()

  return (
    <div className='sidebar-nav'>
      <ul>
        <li>
          <Link to={`/${profile.user.username}`}>View profile</Link>
        </li>
        <li>
          <Link to={`${url}/followers`}>Followers</Link>
        </li>
        <li>
          <Link to={`${url}/following`}>Following</Link>
        </li>
        <li>
          <Link to='/search'>Search</Link>
        </li>
        <li>
          <Link to='/home'>Home</Link>
        </li>
      </ul>
    </div>
  )
}
