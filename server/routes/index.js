const Router = require('express').Router()
const PostRouter = require('./post')
const ImageRouter = require('./image')
const UserRouter = require('./user')

Router.use('/post', PostRouter)

Router.use('/image', ImageRouter)

Router.use('/user', UserRouter)

module.exports = Router
