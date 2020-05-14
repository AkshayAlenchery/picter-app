import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import HomePage from './pages/Homepage'
import './assets/css/index.css'
import Notifications from './components/Notifications'

import { Provider as NotifcationProvider } from './context/NotificationContext'
import { Provider as PostProvider } from './context/PostContext'

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
