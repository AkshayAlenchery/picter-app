import React, { useContext } from 'react'

import Avatar from '../../assets/images/avatar.jpg'
import './style.css'
import { Link } from 'react-router-dom'

import { Context as AuthContext } from '../../context/Auth'

export default ({ user }) => {
  const { authUser } = useContext(AuthContext)
  return (
    <div className='user-row'>
      <div className='user-img'>
        <img src={user.avatar || Avatar} alt={user.username} />
      </div>
      <div className='user-det'>
        <Link to={`/${user.username}`}>
          {user.firstname} {user.lastname}{' '}
          <span style={{ color: '#999' }}>{authUser.user.id === user.id ? '(You)' : ''}</span>
        </Link>
        <p className='bio'>{user.bio}</p>
      </div>
    </div>
  )
}
