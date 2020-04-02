const Router = require('express').Router()
const PostRouter = require('./post')

Router.use('/post', PostRouter)

module.exports = Router
