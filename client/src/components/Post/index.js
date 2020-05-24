import React, { useState, useContext } from 'react'
import moment from 'moment'
import { v1 as genId } from 'uuid'
import Axios from 'axios'
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faHeart as liked
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as like, faComment, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import Comments from '../Comment'
import { Link } from 'react-router-dom'

import { Card, CardBody, Icon } from '../../assets/css/styled-css'
import './style.css'
import avatar from '../../assets/images/avatar.jpg'
import { BASE_URL } from '../../config'

import { Context as PostContext } from '../../context/Post'
import { Context as NotificationContext } from '../../context/Notification'
import { Context as AuthContext } from '../../context/Auth'
import { ADD_NOTI, LIKE_POST, UNLIKE_POST, DELETE_POST } from '../../context/actionTypes'

const PreviewContainer = ({ image, left, right, single }) => {
  return (
    <div className='preview-container'>
      <img src={image} />
      {!single ? (
        <div className='preview-actions'>
          <Icon color='black' fontSize='1.2rem' icon={faChevronCircleLeft} onClick={left} cursor />
          <Icon
            color='black'
            fontSize='1.2rem'
            icon={faChevronCircleRight}
            onClick={right}
            cursor
          />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default ({ postId }) => {
  /**
   * showIndex: Index of the image to be shown in the post
   * showComment: To show the comment container
   */
  const [showIndex, setShowIndex] = useState(0)
  const [showComment, setShowComment] = useState(false)
  const [deleting, setDeleting] = useState(false)
  // Post context
  const { posts, setPost } = useContext(PostContext)
  // Notification context
  const { setNotification } = useContext(NotificationContext)
  // Auth Context
  const { authUser } = useContext(AuthContext)

  // Preview container left
  const moveLeft = () => {
    if (showIndex > 0) setShowIndex(showIndex - 1)
    else setShowIndex(posts.posts.contents[postId].images.length - 1)
  }
  // Preview container right
  const moveRight = () => {
    if (showIndex < posts.posts.contents[postId].images.length - 1) setShowIndex(showIndex + 1)
    else setShowIndex(0)
  }

  // Like post
  const likePost = async () => {
    try {
      const resp = await Axios({
        method: 'POST',
        url: `${BASE_URL}/post/like`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          postId: postId
        }
      })
      setPost({
        action: LIKE_POST,
        data: {
          postId: postId,
          ...resp.data.content
        }
      })
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Could not like the post. Try again later',
          type: 'error',
          color: 'red'
        }
      })
    }
  }

  // Unlike post
  const unLikePost = async () => {
    try {
      const resp = await Axios({
        method: 'DELETE',
        url: `${BASE_URL}/post/unlike`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          likeId: posts.posts.contents[postId].liked
        }
      })
      setPost({
        action: UNLIKE_POST,
        data: {
          postId: postId,
          ...resp.data.content
        }
      })
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Could not unlike the post. Try again later',
          type: 'error',
          color: 'red'
        }
      })
    }
  }

  const deleteImages = async (images) => {
    for (const image of images) {
      const key = image.split('/').slice(-1)[0]
      try {
        await Axios.delete(`${BASE_URL}/image/${key}`)
      } catch (err) {
        return false
      }
    }
    return true
  }

  // Delete post
  const deletePost = async () => {
    try {
      setDeleting(true)
      const resp = await deleteImages(posts.posts.contents[postId].images)
      if (!resp) throw new Error('Failed to delete images')
      await Axios.delete(`${BASE_URL}/post/${postId}`)
      setPost({
        action: DELETE_POST,
        data: {
          postId: postId
        }
      })
      console.log('hello')
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Could not delete post. Try again later',
          type: 'error',
          color: 'red'
        }
      })
    }
  }
  return (
    <Card bottom='0.5em' animate={deleting ? true : false}>
      <CardBody>
        <div className='post-header'>
          <div className='profile-pic'>
            <img
              src={posts.users[posts.posts.contents[postId].author].avatar || avatar}
              alt={posts.users[posts.posts.contents[postId].author].username}
            />
          </div>
          <div className='user-details'>
            <Link to={posts.users[posts.posts.contents[postId].author].username}>
              {posts.users[posts.posts.contents[postId].author].firstname}{' '}
              {posts.users[posts.posts.contents[postId].author].lastname}
            </Link>
            <p>{moment(new Date(Number(posts.posts.contents[postId].timestamp))).fromNow()}</p>
          </div>
        </div>
        <p className='caption'>{posts.posts.contents[postId].caption}</p>
        <PreviewContainer
          image={posts.posts.contents[postId].images[showIndex]}
          left={moveLeft}
          right={moveRight}
          single={posts.posts.contents[postId].images.length === 1 ? true : false}
        />
        <div className='post-actions'>
          <p>
            {posts.posts.contents[postId].liked ? (
              <Icon color='red' icon={liked} onClick={unLikePost} />
            ) : (
              <Icon color='black' icon={like} onClick={likePost} />
            )}{' '}
            {posts.posts.contents[postId].likes}
          </p>
          <p onClick={() => setShowComment(!showComment)}>
            <Icon color='black' icon={faComment} /> {posts.posts.contents[postId].comments}
          </p>
          {posts.posts.contents[postId].author === authUser.user.id ? (
            <p>
              <Icon onClick={deletePost} color='red' icon={faTrashAlt} />
            </p>
          ) : (
            ''
          )}
        </div>
        {showComment ? <Comments postId={postId} /> : ''}
      </CardBody>
    </Card>
  )
}
