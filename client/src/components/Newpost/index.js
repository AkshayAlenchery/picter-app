import React, { useRef, useState, useContext } from 'react'
import Axios from 'axios'
import { v4 as uuid } from 'uuid'

import { Card, CardHeader, CardTitle, CardBody, Icon, Btn } from '../../assets/css/styled-css'
import { Caption, PreviewCont, P } from './style'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { BASE_URL } from '../../config'
import PreviewImage from './preview-image'

import { Context as PostContext } from '../../context/Post'
import { Context as AuthContext } from '../../context/Auth'
import { Context as NotificationContext } from '../../context/Notification'
import { ADD_NOTI, ADD_POST } from '../../context/actionTypes'

export default (props) => {
  const { setNotification } = useContext(NotificationContext)
  const { setPost } = useContext(PostContext)
  const { authUser } = useContext(AuthContext)
  /**
   * States
   * fileCount - To maintain file count
   * upldFiles - All the uploaded files
   * upldStatus - Upload status to avoid submission of post while uploading
   */
  const [fileCount, setFileCount] = useState(10)
  const [caption, setCaption] = useState('')
  const [upldFiles, setUpldFiles] = useState({
    files: []
  })
  const [upldStatus, setUpldStatus] = useState(false) // True - Completed | False - Uploading
  const [uploading, setUploading] = useState(false)

  // Ref to select files
  const fileInp = useRef(null)

  // Auto Increase caption height
  const changeHeight = (event) => {
    event.target.style.height = 'inherit'
    event.target.style.height = `${event.target.scrollHeight}px`
  }

  // Run the ref
  const selectFiles = (event) => {
    event.preventDefault()
    fileInp.current.click()
  }

  // Upload files when you select them
  const uploadFiles = async (event) => {
    setUpldStatus(false)
    const files = Array.from(event.target.files)
    const flLeng = files.length
    if (!flLeng) return
    if (flLeng > 10 || fileCount - flLeng < 0) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: uuid(),
          type: 'error',
          message: 'Cannot upload more than 10 images.',
          color: 'red'
        }
      })
    } else {
      setUploading(true)
      setFileCount(fileCount - flLeng)
      const formData = new FormData()
      for (const image of files) formData.append('images', image)
      try {
        const result = await Axios({
          method: 'POST',
          url: `${BASE_URL}/image/upload`,
          header: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData,
          onUploadProgress: (event) => console.log(Math.round((event.loaded / event.total) * 100))
        })
        setUploading(false)
        setUpldFiles({ files: [...result.data.images, ...upldFiles.files] })
        setNotification({
          action: ADD_NOTI,
          data: {
            id: uuid(),
            type: 'success',
            message: 'Images uploaded successfully.',
            color: 'green'
          }
        })
      } catch (err) {
        setUploading(false)
        setNotification({
          action: ADD_NOTI,
          data: {
            id: uuid(),
            type: 'error',
            message: 'Failed to upload images. Please try again later.',
            color: 'red'
          }
        })
        setFileCount(fileCount + flLeng)
      }
    }
    setUpldStatus(true)
  }

  // Remove uploaded file
  const removePic = async (index) => {
    try {
      const tempFiles = upldFiles.files
      const fileName = tempFiles[index].split('/').slice(-1)[0]
      // Send req to delete file
      await Axios({
        method: 'DELETE',
        url: `${BASE_URL}/image/${fileName}`
      })
      // Delete from state
      tempFiles.splice(index, 1)
      setFileCount(fileCount + 1)
      setUpldFiles({ files: tempFiles })
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: uuid(),
          type: 'error',
          message: 'Failed to remove picture. Please try again later.',
          color: 'red'
        }
      })
    }
  }

  // Create new post
  const createPost = async (event) => {
    event.preventDefault()
    try {
      const result = await Axios({
        method: 'POST',
        url: `${BASE_URL}/post`,
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          caption: caption,
          images: upldFiles.files
        }
      })
      // Set user from logged in user
      result.data.post.users = {
        [authUser.user.id]: {
          username: authUser.user.username,
          avatar: authUser.user.avatar,
          firstname: authUser.user.firstname,
          lastname: authUser.user.lastname
        }
      }
      setPost({
        action: ADD_POST,
        data: result.data.post
      })
      setUpldFiles({ files: [] })
      setFileCount(10)
      setCaption('')
      setNotification({
        action: ADD_NOTI,
        data: {
          id: uuid(),
          type: 'success',
          message: 'Post created successfully.',
          color: 'green'
        }
      })
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: uuid(),
          type: 'error',
          message: 'Could not create a new post. Please try again later.',
          color: 'red'
        }
      })
    }
  }

  return (
    <Card bottom='0.5em'>
      <CardHeader>
        <CardTitle>Create a post</CardTitle>
      </CardHeader>
      <CardBody>
        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={createPost}>
          <input
            type='file'
            style={{ display: 'none' }}
            ref={fileInp}
            accept='image/jpg,image/jpeg'
            onChange={uploadFiles}
            multiple
          />
          <Caption
            placeholder='Write something here...'
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            onKeyDown={changeHeight}
          />
          {uploading ? <P>Uploading files ...</P> : ''}
          <PreviewCont>
            {upldFiles.files.map((image, index) => (
              <PreviewImage key={index} image={image} index={index} removePic={removePic} />
            ))}
          </PreviewCont>
          <div
            style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Btn padding='6px 10px' onClick={selectFiles} disabled={fileCount === 0 ? true : false}>
              <Icon icon={faImage} /> Add photos
            </Btn>
            <Btn
              padding='6px 20px'
              blue
              disabled={!upldStatus || !upldFiles.files.length ? true : false}>
              Post
            </Btn>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
