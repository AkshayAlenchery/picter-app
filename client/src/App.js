import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import HomePage from './pages/homepage'
import './assets/css/index.css'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <HomePage />
        </Route>
      </Switch>
    </Router>
  )
}
