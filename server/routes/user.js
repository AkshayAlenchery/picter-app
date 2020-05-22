const {
  getUserDetails,
  followUser,
  unFollowUser,
  getFollowers,
  getFollowing
} = require('../controllers/user')
const Router = require('express').Router()

// Follow user
Router.post('/follow', followUser)

// Unfollow user
Router.delete('/unfollow/:followId', unFollowUser)

// Get followers
Router.post('/followers/:userId', getFollowers)

// Get following
Router.post('/following/:userId', getFollowing)

// Get user details
Router.get('/:username', getUserDetails)

module.exports = Router
