const Router = require('express').Router()
const { createNewPost, getUserPosts, likePost, unlikePost } = require('../controllers/post')

// Create a new post
Router.post('/', createNewPost)

// Like post
Router.post('/like', likePost)

// Unlike post
Router.delete('/unlike', unlikePost)

// Get all posts of a user
Router.post('/:userId', getUserPosts)

module.exports = Router
