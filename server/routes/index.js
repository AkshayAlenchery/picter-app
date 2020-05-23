const Router = require('express').Router()
const PostRouter = require('./post')
const ImageRouter = require('./image')
const UserRouter = require('./user')
const authUser = require('../services/Auth')

Router.use('/post', authUser, PostRouter)

Router.use('/image', authUser, ImageRouter)

Router.use('/user', UserRouter)

module.exports = Router
