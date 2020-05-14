import React, { useState, useContext } from 'react'
import moment from 'moment'

import { Card, CardBody, Icon } from '../../assets/css/styled-css'
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faHeart as liked
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as like, faComment, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import './style.css'
import avatar from '../../assets/images/avatar.jpg'

import { Context as PostContext } from '../../context/PostContext'

const PreviewContainer = ({ image, left, right, single }) => {
  return (
    <div className='preview-container'>
      <img src={image} />
      {!single ? (
        <div className='preview-actions'>
          <Icon color='black' fontSize='1.2rem' icon={faChevronCircleLeft} onClick={left} cursor />
          <Icon
            color='black'
            fontSize='1.2rem'
            icon={faChevronCircleRight}
            onClick={right}
            cursor
          />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default ({ postId }) => {
  /**
   * showIndex: Index of the image to be shown in the post
   */
  const [showIndex, setShowIndex] = useState(0)
  // Post context
  const { posts } = useContext(PostContext)

  const moveLeft = () => {
    if (showIndex > 0) setShowIndex(showIndex - 1)
    else setShowIndex(posts.posts.contents[postId].images.length - 1)
  }

  const moveRight = () => {
    if (showIndex < posts.posts.contents[postId].images.length - 1) setShowIndex(showIndex + 1)
    else setShowIndex(0)
  }

  return (
    <Card bottom='0.5em'>
      <CardBody>
        <div className='post-header'>
          <div className='profile-pic'>
            <img
              src={posts.users[posts.posts.contents[postId].author].avatar || avatar}
              alt={posts.users[posts.posts.contents[postId].author].username}
            />
          </div>
          <div className='user-details'>
            <a href='#'>
              {posts.users[posts.posts.contents[postId].author].firstname}{' '}
              {posts.users[posts.posts.contents[postId].author].lastname}
            </a>
            <p>{moment(new Date(Number(posts.posts.contents[postId].timestamp))).fromNow()}</p>
          </div>
        </div>
        <p className='caption'>{posts.posts.contents[postId].caption}</p>
        <PreviewContainer
          image={posts.posts.contents[postId].images[showIndex]}
          left={moveLeft}
          right={moveRight}
          single={posts.posts.contents[postId].images.length === 1 ? true : false}
        />
        <div className='post-actions'>
          <p>
            <Icon
              color={posts.posts.contents[postId].liked ? 'red' : 'black'}
              icon={posts.posts.contents[postId].liked ? liked : like}
            />{' '}
            {posts.posts.contents[postId].likes}
          </p>
          <p>
            <Icon color='black' icon={faComment} /> {posts.posts.contents[postId].comments}
          </p>
          {posts.posts.contents[postId].userId === 1 ? ( // Check loggedUser
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
