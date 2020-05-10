import React, { useState } from 'react'

import { Card, CardBody, Icon } from '../../assets/css/styled-css'
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faHeart as liked
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as like, faComment, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import './style.css'

const PreviewContainer = ({ image, left, right }) => {
  return (
    <div className='preview-container'>
      <img src={image} />
      <div className='preview-actions'>
        <Icon color='black' fontSize='1.2rem' icon={faChevronCircleLeft} onClick={left} cursor />
        <Icon color='black' fontSize='1.2rem' icon={faChevronCircleRight} onClick={right} cursor />
      </div>
    </div>
  )
}

export default ({ post }) => {
  /**
   * showIndex: Index of the image to be shown in the post
   */
  const [showIndex, setShowIndex] = useState(0)

  const moveLeft = () => {
    if (showIndex > 0) setShowIndex(showIndex - 1)
    else setShowIndex(post.post_images.length - 1)
  }

  const moveRight = () => {
    if (showIndex < post.post_images.length - 1) setShowIndex(showIndex + 1)
    else setShowIndex(0)
  }

  return (
    <Card>
      <CardBody>
        <div className='post-header'>
          <div className='profile-pic'>
            <img
              src='https://www.getuppeople.com/upload/photo/users_profile/2419_.jpg'
              alt={post.username}
            />
          </div>
          <div className='user-details'>
            <a href='#'>
              {post.firstname} {post.lastname}
            </a>
            <p>15 hours ago</p>
          </div>
        </div>
        <PreviewContainer image={post.post_images[showIndex]} left={moveLeft} right={moveRight} />
        <div className='post-actions'>
          <p>
            <Icon color={post.liked ? 'red' : 'black'} icon={post.liked ? liked : like} />{' '}
            {post.likes}
          </p>
          <p>
            <Icon color='black' icon={faComment} /> {post.comments}
          </p>
          {post.userId === '1234' ? ( // Check loggedUser
            <p>
              <Icon color='red' icon={faTrashAlt} />
            </p>
          ) : (
            ''
          )}
        </div>
      </CardBody>
    </Card>
  )
}
