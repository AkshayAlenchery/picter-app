import React, { useRef, useState, useContext } from 'react'
import { v1 as genId } from 'uuid'
import Axios from 'axios'

import { Card, CardBody, CardHeader, CardTitle } from '../../assets/css/styled-css'
import Loader from '../../assets/images/loader.svg'
import Avatar from '../../assets/images/avatar.jpg'
import { BASE_URL } from '../../config'

import { Context as NotificationContext } from '../../context/Notification'
import { Context as ProfileContext } from '../../context/Profile'
import { Context as AuthContext } from '../../context/Auth'
import { ADD_NOTI, UPDATE_PROFILE, UPDATE_AUTH_USER } from '../../context/actionTypes'

import './edit-profile.css'

export default () => {
  // Ref for input file
  const profilePic = useRef(null)

  // Context
  const { setNotification } = useContext(NotificationContext)
  const { profile, setProfile } = useContext(ProfileContext)
  const { setAuthUser } = useContext(AuthContext)

  // To store the updated data
  const [profileInfo, setProfileInfo] = useState({ ...profile.user })
  const [updatedData, setUpdatedData] = useState({})
  const [uploading, setUploading] = useState(false)
  const [password, setPassword] = useState({})

  // Function to run the ref
  const selectFile = () => {
    profilePic.current.click()
  }

  // Upload profile pic
  const changePic = async (event) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('images', event.target.files[0])
      console.log(event.target.files[0])
      const resp = await Axios({
        method: 'POST',
        url: `${BASE_URL}/image/upload`,
        header: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      })
      setUpdatedData({
        ...updatedData,
        avatar: resp.data.images[0]
      })
      setProfileInfo({
        ...profileInfo,
        avatar: resp.data.images[0]
      })
      setUploading(false)
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Could not upload picture. Please try again later',
          type: 'error',
          color: 'red'
        }
      })
    }
  }

  // Update data
  const updateDetails = (event) => {
    setUpdatedData({
      ...updatedData,
      [event.target.name]: event.target.value
    })
    setProfileInfo({
      ...profileInfo,
      [event.target.name]: event.target.value
    })
  }

  // Update data
  const updatePassword = (event) => {
    setPassword({
      ...password,
      [event.target.name]: event.target.value
    })
  }

  // Save changed details
  const saveDetails = async () => {
    try {
      if (!profileInfo.firstname || !profileInfo.lastname) {
        setNotification({
          action: ADD_NOTI,
          data: {
            id: genId(),
            message: 'First name or Last name cant be empty',
            type: 'error',
            color: 'red'
          }
        })
        return null
      }
      const resp = await Axios({
        method: 'POST',
        url: `${BASE_URL}/user/update`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: updatedData
      })
      setProfile({
        action: UPDATE_PROFILE,
        data: resp.data
      })
      setAuthUser({
        action: UPDATE_AUTH_USER,
        data: {
          id: resp.data.id,
          username: resp.data.username,
          firstname: resp.data.firstname,
          lastname: resp.data.lastname,
          avatar: resp.data.avatar
        }
      })
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Details updated',
          type: 'success',
          color: 'green'
        }
      })
      setUpdatedData({})
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Could not update your details. Please try again later',
          type: 'error',
          color: 'red'
        }
      })
    }
  }

  // Save password
  const savePassword = async () => {
    try {
      await Axios({
        method: 'POST',
        url: `${BASE_URL}/user/update/password`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: password
      })
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Password changed successfully',
          type: 'success',
          color: 'green'
        }
      })
      setPassword({})
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: err.response.data.message,
          type: 'error',
          color: 'red'
        }
      })
    }
  }

  // Remove Picture
  const removePic = () => {
    setUpdatedData({ ...updatedData, avatar: '' })
    setProfileInfo({ ...profileInfo, avatar: '' })
    document.getElementById('avatar').src = Avatar
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
        </CardHeader>
        <CardBody>
          <div className='edit-container'>
            <div className='edit-pic'>
              <div>
                {uploading ? (
                  <Loader />
                ) : (
                  <img id='avatar' src={profileInfo.avatar || Avatar} alt='name' />
                )}
              </div>
              <p onClick={selectFile}>Change profile picture | </p>
              <p onClick={removePic}>Remove pic</p>
              <input
                type='file'
                style={{ display: 'none' }}
                ref={profilePic}
                onChange={changePic}
              />
            </div>
            {/* <div className='input-row'>
            <label>Username</label>
            <input
              onChange={updateDetails}
              value={updatedData.username || profile.user.username}
              name='username'
              type='text'
            />
          </div> */}
            <div className='input-row'>
              <label>First Name</label>
              <input
                onChange={updateDetails}
                value={profileInfo.firstname}
                name='firstname'
                type='text'
                required
              />
            </div>
            <div className='input-row'>
              <label>Last Name</label>
              <input
                onChange={updateDetails}
                value={profileInfo.lastname}
                name='lastname'
                type='text'
                required
              />
            </div>
            <div className='input-row'>
              <label>Bio</label>
              <textarea onChange={updateDetails} name='bio' value={profileInfo.bio} />
            </div>
            <div className='save-btn'>
              <button onClick={saveDetails}>Save</button>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card style={{ marginTop: '0.5em' }}>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardBody>
          <div className='edit-container'>
            <div className='input-row'>
              <label>Password</label>
              <input
                onChange={updatePassword}
                value={password.password || ''}
                name='password'
                type='password'
                required
              />
            </div>
            <div className='input-row'>
              <label>New Password</label>
              <input
                onChange={updatePassword}
                value={password.newPassword || ''}
                name='newPassword'
                type='password'
                required
              />
            </div>
            <div className='save-btn'>
              <button onClick={savePassword}>Change password</button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
