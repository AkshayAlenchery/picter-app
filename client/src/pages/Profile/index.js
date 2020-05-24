import React, { useEffect, useState, useContext } from 'react'
import { Link, useParams, useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'
import Axios from 'axios'
import { v1 as genId } from 'uuid'
import './style.css'

import { BASE_URL } from '../../config'
import ProfileSection from '../../components/Profile'
import Navbar from '../../components/Navbar'
import Post from '../../components/Post'
import Followers from '../Followers'
import Following from '../Following'
import EditProfile from '../../components/Profile/edit-profile'
import SidebarNav from '../../components/Sidebar/navbar'

import { Context as ProfileContext } from '../../context/Profile'
import { Context as NotificationContext } from '../../context/Notification'
import { Context as PostContext } from '../../context/Post'
import { Context as AuthContext } from '../../context/Auth'
import { SET_PROFILE, ADD_NOTI, SET_POSTS, RESET } from '../../context/actionTypes'

export default () => {
  const { username } = useParams()
  const { url, path } = useRouteMatch()
  /**
   * loading: To check if user checking is completed
   * checkUser: To check if user is valid or not
   * loadMore: To load more posts
   */
  const [loading, setLoading] = useState(true)
  const [checkUser, setCheckUser] = useState(true)
  const [loadMore, setLoadMore] = useState(true)

  const { profile, setProfile } = useContext(ProfileContext)
  const { setNotification } = useContext(NotificationContext)
  const { posts, setPost } = useContext(PostContext)
  const { authUser } = useContext(AuthContext)

  // To load user posts
  const getPosts = async (userId, current) => {
    try {
      const result = await Axios({
        method: 'POST',
        url: `${BASE_URL}/post/${userId}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          current: current
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

  // To fetch user details
  const getUserDetails = async () => {
    try {
      const userDetails = await Axios.get(`${BASE_URL}/user/${username}`)
      setProfile({
        action: SET_PROFILE,
        data: userDetails.data.user
      })
      setPost({ action: RESET, data: {} })
      // wait and change the state
      setLoadMore(true)
      getPosts(userDetails.data.user.user.id, 0)
    } catch (err) {
      setCheckUser(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    getUserDetails()
  }, [username])

  return !loading && !checkUser ? (
    <Redirect to='/404' />
  ) : (
    <div>
      <Navbar />
      <div className='p-container'>
        <div className='p-contents'>
          <ProfileSection />
          <div className='user-contents'>
            <div className='post-contents'>
              {
                <Switch>
                  <Route path={`${path}/edit`}>
                    {profile.user.id === authUser.user.id ? (
                      <EditProfile />
                    ) : (
                      <Redirect to={`${url}`} />
                    )}
                  </Route>
                  <Route path={`${path}/following`}>
                    <Following />
                  </Route>
                  <Route path={`${path}/followers`}>
                    <Followers />
                  </Route>
                  <Route path={`${path}`}>
                    {!posts.posts.ids.length ? (
                      <p className='muted-text center'>No posts to show</p>
                    ) : (
                      posts.posts.ids.map((id) => <Post key={id} postId={id} />)
                    )}
                    {posts.posts.ids.length & loadMore ? (
                      <div className='load-posts'>
                        <p
                          onClick={() =>
                            getPosts(profile.user.id, posts.posts.ids[posts.posts.ids.length - 1])
                          }>
                          Load more posts
                        </p>
                      </div>
                    ) : (
                      ''
                    )}
                  </Route>
                </Switch>
              }
            </div>
            <div className='profile-nav'>
              <SidebarNav />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
