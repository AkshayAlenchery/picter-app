import React, { useState } from 'react'
import { Icon } from '../../assets/css/styled-css'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

import './style.css'

export default (props) => {
  const [showDropdown, setDropdown] = useState(false)
  return (
    <header>
      <div className='container'>
        <h1 className='logo'>Picter</h1>
        <div className='dropdown'>
          <div className='dropdown-header' onClick={() => setDropdown(!showDropdown)}>
            <img src='https://avatars0.githubusercontent.com/u/289245?s=460&u=b3e7392a41bed7a982e2753369ef9d031d3ac46f&v=4' />
            <p>Justin</p>
            <Icon icon={faAngleDown} />
          </div>
          {showDropdown ? (
            <div className='dropdown-list'>
              <ul>
                <li>
                  <a href='#'>View profile</a>
                </li>
                <li>
                  <a href='#'>Search</a>
                </li>
                <li>
                  <a href='#'>Logout</a>
                </li>
              </ul>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </header>
  )
}
