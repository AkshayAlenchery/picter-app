const Router = require('express').Router()
const { createNewPost } = require('../controllers/post')

// Create a new post
Router.post('/', createNewPost)

module.exports = Router
