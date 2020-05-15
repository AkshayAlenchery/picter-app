const pool = require('../db/')
const ImageUpload = require('../middlewares/imageUpload')
const { promisify } = require('util')
const fs = require('fs')

/**
 * Upload images and return the urls
 * @param req
 * @param res
 * @return file URL's | error
 */
const uploadImages = async (req, res) => {
  const uploader = promisify(ImageUpload.array('images', 10))
  try {
    await uploader(req, res)
    if (!req.files.length) return res.status(400).json({ message: 'Please select files to upload' })
    const files = req.files.map(
      (file) => `http://localhost:${process.env.APP_PORT}/picter/api/image/${file.filename}`
    )
    return res.status(200).json({ message: 'Uploaded files', images: files })
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(500).json({ message: 'Image size cannot be more than 5MB.' })
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(500).json({ message: 'Cannot upload more than 10 images' })
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(500).json({ message: 'Please select an image file to upload.' })
    }
    return res.status(500).json({ message: 'Failed to upload. There was an error.' })
  }
}

/**
 * Create a new post
 * @param req
 * @param res
 * @returns new post | error
 */
const createNewPost = async (req, res) => {
  try {
    const { caption, images } = req.body
    if (!images.length) return res.status(400).json({ message: 'Please select files to upload' })
    const userId = 1 // Get from logged in user
    const query =
      'INSERT INTO posts (caption, image_urls, posted_by, posted_on) VALUES ($1, $2, $3, $4) RETURNING *'
    const values = [caption, images, userId, Date.now()]
    const result = await pool.query(query, values)
    const post = result.rows[0]
    const resp = {
      posts: {
        contents: {},
        ids: []
      },
      users: {},
      comments: {}
    }
    resp.posts.contents[post.post_id] = {
      caption: post.caption,
      images: post.image_urls,
      timestamp: post.posted_on,
      likes: post.like_count,
      comments: post.comment_count,
      commentIds: [],
      author: post.posted_by,
      liked: false
    }
    resp.posts.ids.push(post.post_id)
    return res.status(200).json({ message: 'Added new post', post: resp })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to upload. There was an error.' })
  }
}

/**
 * Delete an image
 * @param req
 * @param res
 * @returns success msg | error
 */
const deleteImage = async (req, res) => {
  const removeFile = promisify(fs.unlink)
  try {
    await removeFile(`uploads/${req.params.image}`)
    res.status(200).json({ message: 'File removed!' })
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(500).json({ message: 'File doesnot exist. Failed to delete.' })
    }
    return res.status(500).json({ message: 'There was an error. Failed to delete.' })
  }
}

/**
 * Get all the user posts
 * @param req
 * @param res
 * @returns posts | error
 */
const getUserPosts = async (req, res) => {
  const loggedUserId = 1
  const { userId } = req.params
  const { current } = req.body
  try {
    const stmt1 =
      'SELECT posts.*, username, first_name, last_name, profile_pic, like_id FROM posts INNER JOIN users ON posts.posted_by = users.user_id LEFT JOIN likes ON likes.post_id = posts.post_id AND likes.user_id = $1 WHERE posted_by = $2'
    const stmt2 = 'ORDER BY post_id desc LIMIT 5'
    let query = null
    const values = [loggedUserId, userId]
    if (current > 0) {
      query = stmt1 + ' AND post_id < $3 ' + stmt2
      values.push(current)
    } else query = stmt1 + stmt2
    const result = await pool.query(query, values)
    const posts = {
      contents: {},
      ids: []
    }
    const users = {}
    result.rows.forEach((post) => {
      posts.contents[post.post_id] = {
        caption: post.caption,
        images: post.image_urls,
        timestamp: post.posted_on,
        likes: post.like_count,
        comments: post.comment_count,
        commentIds: [],
        author: post.posted_by,
        liked: post.like_id || false
      }
      posts.ids.push(post.post_id)
      if (!(post.posted_by in users)) {
        users[post.posted_by] = {
          username: post.username,
          firstname: post.first_name,
          lastname: post.last_name,
          avatar: post.profile_pic
        }
      }
    })
    return res.status(200).json({ posts, users, comments: [] })
  } catch (err) {
    return res
      .status(500)
      .json({ message: ' There was an error while fetching posts. Please try again later.' })
  }
}

/**
 * Like a post
 * @param req { body: postId }
 * @param res
 * @returns Error | like details
 */
const likePost = async (req, res) => {
  const { postId } = req.body
  const loggedUserId = 1 // Fetch from login status
  try {
    let stmt =
      'INSERT INTO likes (post_id, user_id, liked_on) VALUES ($1, $2, $3) returning like_id'
    let result = await pool.query(stmt, [postId, loggedUserId, Date.now()])
    const resp = { id: result.rows[0].like_id, likes: 0 }
    stmt = 'UPDATE posts SET like_count = like_count + 1 WHERE post_id = $1 RETURNING like_count'
    result = await pool.query(stmt, [postId])
    resp.likes = result.rows[0].like_count
    return res.status(200).json({ message: 'Post liked', content: resp })
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'There was an error while liking the post. PLease try again later' })
  }
}

const unlikePost = async (req, res) => {
  const { likeId } = req.body
  try {
    let stmt = 'DELETE FROM likes WHERE like_id = $1 RETURNING *'
    let result = await pool.query(stmt, [likeId])
    stmt = 'UPDATE posts SET like_count = like_count - 1 WHERE post_id = $1 RETURNING like_count'
    result = await pool.query(stmt, [result.rows[0].post_id])
    return res.status(200).json({
      message: 'Post unliked',
      content: { liked: false, likes: result.rows[0].like_count }
    })
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'There was an error while unliking the post. PLease try again later' })
  }
}

module.exports = { createNewPost, uploadImages, deleteImage, getUserPosts, likePost, unlikePost }
