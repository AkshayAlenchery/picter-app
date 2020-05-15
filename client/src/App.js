import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import HomePage from './pages/Homepage'
import './assets/css/index.css'
import Notifications from './components/Notifications'

import { Provider as NotifcationProvider } from './context/Notification'
import { Provider as PostProvider } from './context/Post'

export default (props) => {
  return (
    <NotifcationProvider>
      <Notifications />
      <Router>
        <Switch>
          <Route exact path='/'>
            <PostProvider>
              <HomePage />
            </PostProvider>
          </Route>
        </Switch>
      </Router>
    </NotifcationProvider>
  )
}
