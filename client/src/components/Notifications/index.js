import React, { useContext } from 'react'

import { Card, CardBody, Icon } from '../../assets/css/styled-css'
import { faTimesCircle, faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Context as NotificationContext } from '../../context/Notification'
import { REMOVE_NOTI } from '../../context/actionTypes'

import './style.css'

export const Notification = ({ notification, index, dispatch }) => {
  return (
    <Card shadow>
      <CardBody>
        <div className='notification'>
          <Icon
            icon={notification.type === 'error' ? faTimesCircle : faCheckCircle}
            fontSize='0.9em'
            color={notification.color}
          />
          <p>{notification.message}</p>
          <Icon
            icon={faTimes}
            fontSize='0.8em'
            color='#999'
            style={{ cursor: 'pointer' }}
            onClick={() => dispatch({ action: REMOVE_NOTI, data: notification.id })}
          />
        </div>
      </CardBody>
    </Card>
  )
}

export default () => {
  const { notifications, setNotification } = useContext(NotificationContext)
  return (
    <div id='noti-container'>
      <div id='contents'>
        {notifications.map((row) => (
          <Notification notification={row} key={row.id} dispatch={setNotification} />
        ))}
      </div>
    </div>
  )
}
