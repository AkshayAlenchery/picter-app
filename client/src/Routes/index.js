import React, { useEffect, useContext, useState } from 'react'
import { Switch, Route, useLocation, Redirect, Router } from 'react-router-dom'
import Axios from 'axios'

import { Provider as PostProvider } from '../context/Post'
import { Provider as ProfileProvider } from '../context/Profile'
import { Context as AuthContext } from '../context/Auth'
import { LOGIN_USER } from '../context/actionTypes'

import { BASE_URL } from '../config'

import HomePage from '../pages/Homepage'
import ProfilePage from '../pages/Profile'
import SearchPage from '../pages/Search'
import RegisterPage from '../pages/Register'
import LoginPage from '../pages/Login'

export default () => {
  const { authUser, setAuthUser } = useContext(AuthContext)

  const [logCheck, setLogCheck] = useState(false)
  const location = useLocation()
  const authRoutes = {
    '/': LoginPage,
    '/register': RegisterPage
  }

  const getCookie = (name) => {
    const cookieName = name + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length)
      }
    }
    return false
  }

  useEffect(() => {
    const checkLogin = async () => {
      if (!authUser.isAuth && getCookie('x-auth-token')) {
        Axios.defaults.headers.common['x-auth-token'] = getCookie('x-auth-token')
        try {
          const resp = await Axios.get(`${BASE_URL}/auth/check`)
          setAuthUser({
            action: LOGIN_USER,
            data: resp.data
          })
        } catch (err) {
          document.cookie = 'x-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          delete Axios.defaults.headers.common['x-auth-token']
        }
      }
      setLogCheck(true)
    }
    checkLogin()
  }, [])

  if (logCheck && authUser.isAuth) {
    if (location.pathname in authRoutes) return <Redirect to='/home' />
    return (
      <Switch>
        <Route exact path='/home'>
          <PostProvider>
            <HomePage />
          </PostProvider>
        </Route>
        <Route exact path='/search'>
          <SearchPage />
        </Route>
        <Route exact path='/404'>
          <h1>Not found</h1>
        </Route>
        <Route path='/:username'>
          <ProfileProvider>
            <PostProvider>
              <ProfilePage />
            </PostProvider>
          </ProfileProvider>
        </Route>
      </Switch>
    )
  }
  if (logCheck) {
    if (!(location.pathname in authRoutes)) return <Redirect to='/' />
    return (
      <Switch>
        <Route exact path='/'>
          <LoginPage />
        </Route>
        <Route exact path='/register'>
          <RegisterPage />
        </Route>
        <Route path='*'>
          <h1>Not found</h1>
        </Route>
      </Switch>
    )
  }
  return ''
}
