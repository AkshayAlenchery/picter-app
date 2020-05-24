import React, { useState, useContext } from 'react'
import Axios from 'axios'
import { v1 as genId } from 'uuid'
import moment from 'moment'
import { Link } from 'react-router-dom'

import Avatar from '../../assets/images/avatar.jpg'
import { BASE_URL } from '../../config'
import './style.css'

import { Context as NotificationContext } from '../../context/Notification'
import { Context as AuthContext } from '../../context/Auth'
import { Context as PostContext } from '../../context/Post'
import { ADD_NOTI, ADD_COMMENT, SET_COMMENTS, DELETE_COMMENT } from '../../context/actionTypes'

const Comment = ({ commentId }) => {
  const { posts, setPost } = useContext(PostContext)
  const { setNotification } = useContext(NotificationContext)
  const { authUser } = useContext(AuthContext)

  // Delete comment
  const deleteComment = async () => {
    try {
      const resp = await Axios({
        method: 'DELETE',
        url: `${BASE_URL}/post/comment`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          commentId: commentId
        }
      })
      setPost({
        action: DELETE_COMMENT,
        data: {
          ...resp.data.content,
          commentId: commentId
        }
      })
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Could not delete the comment. Please try again later',
          type: 'error',
          color: 'red'
        }
      })
    }
  }

  return (
    <div className='comment'>
      <div className='comment-img'>
        <img src={posts.users[posts.comments[commentId].author].avatar || Avatar} />
      </div>
      <div className='comment-contents'>
        <div className='comment-user'>
          <Link to={posts.users[posts.comments[commentId].author].username}>
            {posts.users[posts.comments[commentId].author].firstname}{' '}
            {posts.users[posts.comments[commentId].author].lastname}
          </Link>
        </div>
        <p className='comment-text'>{posts.comments[commentId].comment}</p>
        <div className='comment-footer'>
          <p className='comment-time'>
            {moment(new Date(Number(posts.comments[commentId].timestamp))).fromNow()}
          </p>
          <p className='split' />
          {posts.comments[commentId].author === authUser.user.id ? (
            <p className='comment-delete' onClick={deleteComment}>
              Delete
            </p>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default ({ postId }) => {
  // Comment state
  const [comment, setComment] = useState('')
  // Notification context
  const { setNotification } = useContext(NotificationContext)
  // Post context
  const { posts, setPost } = useContext(PostContext)
  // Comment balance
  const [commentBal, setCommentBal] = useState(
    posts.posts.contents[postId].comments - posts.posts.contents[postId].commentIds.length
  )

  // Add a new comment
  const addComment = async (e) => {
    if (e.key === 'Enter' && comment) {
      try {
        const resp = await Axios({
          method: 'POST',
          url: `${BASE_URL}/post/comment`,
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            postId: postId,
            comment: comment
          }
        })
        resp.data.contents.user = {
          1: {
            username: 'akshayalenchery',
            firstname: 'Akshay',
            lastname: 'Alenchery',
            avatar: ''
          }
        }
        setPost({
          action: ADD_COMMENT,
          data: resp.data.contents
        })
        setComment('')
      } catch (err) {
        setNotification({
          action: ADD_NOTI,
          data: {
            id: genId(),
            message: 'Could not add the comment. Please try again later',
            type: 'error',
            color: 'red'
          }
        })
      }
    }
  }

  // Load comments of the post
  const loadComments = async () => {
    try {
      const resp = await Axios({
        method: 'POST',
        url: `${BASE_URL}/post/getcomment`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          current: posts.posts.contents[postId].commentIds[0] || 0,
          postId: postId
        }
      })
      setPost({
        action: SET_COMMENTS,
        data: resp.data.comments
      })
      setCommentBal(commentBal - resp.data.comments.commentIds.length)
    } catch (err) {
      setNotification({
        action: ADD_NOTI,
        data: {
          id: genId(),
          message: 'Could not load comments. Please try again later',
          type: 'error',
          color: 'red'
        }
      })
    }
  }

  return (
    <div className='comment-container'>
      {commentBal ? (
        <p onClick={loadComments} className='comment-balance'>
          View all {commentBal} comments
        </p>
      ) : (
        ''
      )}
      {posts.posts.contents[postId].commentIds.map((commentId) => {
        return <Comment key={commentId} commentId={commentId} />
      })}
      <input
        type='text'
        placeholder='Write a comment ...'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyPress={addComment}
      />
    </div>
  )
}
