const Router = require('express').Router()
const { createNewPost, getUserPosts } = require('../controllers/post')

// Create a new post
Router.post('/', createNewPost)

// Get all posts of a user
Router.post('/:userId', getUserPosts)

module.exports = Router
