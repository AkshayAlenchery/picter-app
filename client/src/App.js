import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import './assets/css/index.css'
import Notifications from './components/Notifications'

import Approute from './Routes/index'

import { Provider as NotifcationProvider } from './context/Notification'

export default (props) => {
  return (
    <NotifcationProvider>
      <Notifications />
      <Router>
        <Approute />
      </Router>
    </NotifcationProvider>
  )
}
