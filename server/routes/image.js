const Router = require('express').Router()
const { deleteImage } = require('../controllers/post')

// Remove uploaded images
Router.delete('/:image', deleteImage)

module.exports = Router
