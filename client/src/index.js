import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/index.css'
import NewPost from './components/Newpost'
import Notifications from './components/Notifications'
import { Provider as NotificationProvider } from './context/NotificationContext'

const App = () => {
  return (
    <div>
      <NotificationProvider>
        <Notifications />
        <div style={{ width: '100%' }}>
          <h1>Hello Akshay</h1>
          <NewPost />
        </div>
      </NotificationProvider>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
