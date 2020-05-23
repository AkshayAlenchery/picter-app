const { registerUser, loginUser, checkUser } = require('../controllers/user')
const Router = require('express').Router()
const authUser = require('../services/Auth')

// Register user
Router.post('/register', registerUser)

// Login user
Router.post('/login', loginUser)

// Check logged in and get details
Router.get('/check', authUser, checkUser)

module.exports = Router
