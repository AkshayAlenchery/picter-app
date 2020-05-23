import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { Provider as PostProvider } from '../context/Post'
import { Provider as ProfileProvider } from '../context/Profile'

import HomePage from '../pages/Homepage'
import ProfilePage from '../pages/Profile'

export default () => {
  return (
    <Switch>
      <Route exact path='/'>
        <PostProvider>
          <HomePage />
        </PostProvider>
      </Route>
      <Route exact path='/404'>
        <h1>Page not found</h1>
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
