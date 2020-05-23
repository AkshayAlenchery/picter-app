import React from 'react'

import Avatar from '../../assets/images/avatar.jpg'
import './style.css'
import { Link } from 'react-router-dom'

export default ({ user }) => {
  return (
    <div className='user-row'>
      <div className='user-img'>
        <img src={user.avatar || Avatar} alt={user.username} />
      </div>
      <div className='user-info'>
        <Link to={`/${user.username}`}>
          {user.firstname} {user.lastname}
        </Link>
        <p className='bio'>{user.bio}</p>
      </div>
    </div>
  )
}
