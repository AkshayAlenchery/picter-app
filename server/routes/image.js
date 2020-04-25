const Router = require('express').Router()
const { deleteImage, uploadImages } = require('../controllers/post')

// Remove uploaded images
Router.delete('/:image', deleteImage)

// Upload images
Router.post('/upload', uploadImages)

module.exports = Router
