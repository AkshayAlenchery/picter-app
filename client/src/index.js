import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/index.css'
import NewPost from './components/Newpost'

const App = () => {
  return (
    <div style={{ width: '100%' }}>
      <h1>Hello Akshay</h1>
      <NewPost />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
