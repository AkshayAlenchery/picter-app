import React, { useState, Profiler, useContext } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

import Avatar from '../../assets/images/avatar.jpg'
import ProfileButton from '../../components/Follow'

import { Context as ProfileContext } from '../../context/Profile'
import { Context as AuthContext } from '../../context/Auth'
import { ADD_FOLLOWER, REMOVE_FOLLOWER } from '../../context/actionTypes'

import './style.css'

export default (props) => {
  const { url } = useRouteMatch()

  const { authUser } = useContext(AuthContext)
  const { profile, setProfile } = useContext(ProfileContext)

  // Add follower
  const follow = (data) => {
    setProfile({
      action: ADD_FOLLOWER,
      data: {
        user: {
          followers: data.followerCount,
          isFollowing: data.isFollowing
        },
        followers: data.followers,
        users: data.users
      }
    })
  }

  // Unfollow user
  const unfollow = (data) => {
    setProfile({
      action: REMOVE_FOLLOWER,
      data: {
        unFollower: data.unFollower,
        followers: data.followerCount,
        isFollowing: data.isFollowing
      }
    })
  }

  return (
    <div className='profile-container'>
      {/* Image */}
      <div class='image-container'>
        <img src={profile.user.avatar || Avatar} alt={profile.user.username} />
      </div>
      {/* Profile info */}
      <div>
        {/* Basic info */}
        <div className='basic-info'>
          <Link to={`${url}`}>
            {profile.user.firstname} {profile.user.lastname}
          </Link>
        </div>
        {/* Bio and link */}
        <div className='bio-info'>
          <p>{profile.user.bio}</p>
        </div>
        {/* Follow info */}
        <div className='follow-info'>
          <Link to={`${url}/followers`}>
            <span className='bold'>{profile.user.followers}</span> Followers
          </Link>
          <Link to={`${url}/following`}>
            <span className='bold'>{profile.user.following}</span> Following
          </Link>
        </div>
        {/* Follow button */}
        <div className='profile-actions'>
          <ProfileButton
            loggedInUser={authUser.user.id}
            userId={profile.user.id}
            isFollowing={profile.user.isFollowing}
            follow={follow}
            unFollow={unfollow}
          />
        </div>
      </div>
    </div>
  )
}
