import React, { useEffect, useContext, useState } from 'react'
import Axios from 'axios'
import { v1 as genId } from 'uuid'

import Navbar from '../../components/Navbar'
import Newpost from '../../components/Newpost'
import Post from '../../components/Post'
import './style.css'
import { BASE_URL } from '../../config'
import ProfileSidebar from '../../components/Sidebar/profile'

import { Context as NotificationContext } from '../../context/Notification'
import { Context as AuthContext } from '../../context/Auth'
import { Context as PostContext } from '../../context/Post'
import { ADD_NOTI, SET_POSTS } from '../../context/actionTypes'

export default (props) => {
  // Notification context
  const { setNotification } = useContext(NotificationContext)
  // Post context
  const { posts, setPost } = useContext(PostContext)
  // Auth user context
  const { authUser } = useContext(AuthContext)
  // State to store id of last post
  const [currentId, setCurrentId] = useState(0)
  // State for no more post
  const [loadMore, setLoadMore] = useState(true)

  // Load all posts
  useEffect(() => {
    const getPosts = async () => {
      try {
        const result = await Axios({
          method: 'POST',
          url: `${BASE_URL}/user/newsfeed`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            current: currentId
          }
        })
        if (!result.data.posts.ids.length) return setLoadMore(false)
        setPost({
          action: SET_POSTS,
          data: result.data
        })
      } catch (err) {
        setNotification({
          action: ADD_NOTI,
          data: {
            id: genId(),
            message: 'There was an error while loading posts. Please try again later',
            type: 'error',
            color: 'red'
          }
        })
      }
    }
    getPosts()
  }, [currentId])
  return (
    <div>
      <Navbar />
      <div className='container'>
        <div className='main-contents'>
          <div className='contents'>
            <Newpost />
            {!posts.posts.ids.length ? (
              <p className='muted-text'>No posts to show</p>
            ) : (
              posts.posts.ids.map((id) => <Post key={id} postId={id} />)
            )}
            {loadMore ? (
              <div className='load-posts'>
                <p onClick={() => setCurrentId(posts.posts.ids[posts.posts.ids.length - 1])}>
                  Load more posts
                </p>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className='sidebar-profile'>
            <ProfileSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
