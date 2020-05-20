const Router = require('express').Router()
const {
  createNewPost,
  getUserPosts,
  likePost,
  unlikePost,
  comment,
  deleteComment,
  getComment,
  deletePost
} = require('../controllers/post')

// Create a new post
Router.post('/', createNewPost)

// Like post
Router.post('/like', likePost)

// Unlike post
Router.delete('/unlike', unlikePost)

// Comment on a post
Router.post('/comment', comment)

// Delete comment
Router.delete('/comment', deleteComment)

// Get Comments
Router.post('/getcomment', getComment)

// Delete post
Router.delete('/:postId', deletePost)

// Get all posts of a user
Router.post('/:userId', getUserPosts)

module.exports = Router
