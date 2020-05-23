const Router = require('express').Router()
const PostRouter = require('./post')
const ImageRouter = require('./image')
const UserRouter = require('./user')
const AuthRouter = require('./auth')
const authUser = require('../services/Auth')

Router.use('/post', authUser, PostRouter)

Router.use('/image', authUser, ImageRouter)

Router.use('/user', authUser, UserRouter)

Router.use('/auth', AuthRouter)

module.exports = Router
