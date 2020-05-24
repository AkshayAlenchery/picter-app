import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import './assets/css/index.css'
import Notifications from './components/Notifications'

import Approute from './Routes/index'
import Footer from './components/Footer'

import { Provider as NotifcationProvider } from './context/Notification'
import { Provider as AuthProvider } from './context/Auth'

export default (props) => {
  return (
    <div>
      <NotifcationProvider>
        <Notifications />
        <Router>
          <AuthProvider>
            <Approute />
          </AuthProvider>
        </Router>
      </NotifcationProvider>
      <Footer />
    </div>
  )
}
