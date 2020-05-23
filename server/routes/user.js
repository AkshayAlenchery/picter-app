const {
  getUserDetails,
  followUser,
  unFollowUser,
  getFollowers,
  getFollowing,
  updateProfile,
  searchUser,
  registerUser,
  loginUser
} = require('../controllers/user')
const authUser = require('../services/Auth')
const Router = require('express').Router()

// Follow user
Router.post('/follow', authUser, followUser)

// Unfollow user
Router.delete('/unfollow/:followId', authUser, unFollowUser)

// Get followers
Router.post('/followers/:userId', authUser, getFollowers)

// Get following
Router.post('/following/:userId', authUser, getFollowing)

// Update details
Router.post('/update', authUser, updateProfile)

// Search user
Router.get('/search/:name/:current', authUser, searchUser)

// Register user
Router.post('/register', registerUser)

// Login user
Router.post('/login', loginUser)

// Get user details
Router.get('/:username', authUser, getUserDetails)

module.exports = Router
