const Router = require('express').Router()
const PostRouter = require('./post')
const ImageRouter = require('./image')

Router.use('/post', PostRouter)

Router.use('/image', ImageRouter)

module.exports = Router
