const Router = require('express').Router()
const { createNewPost, uploadImages } = require('../controllers/post')

// Create a new post
Router.post('/', createNewPost)

// Upload images
Router.post('/upload', uploadImages)

module.exports = Router
