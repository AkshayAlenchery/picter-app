const Router = require('express').Router()
const { addNewPost, uploadImages } = require('../controllers/post')

// Add new post
Router.post('/', addNewPost)

// Upload images
Router.post('/upload/images', uploadImages)

module.exports = Router
