const pool = require('../db/')

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
    const userId = req.user.id
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
 * Get all the user posts
 * @param req
 * @param res
 * @returns posts | error
 */
const getUserPosts = async (req, res) => {
  const loggedUserId = req.user.id
  const { userId } = req.params
  const { current } = req.body
  try {
    const stmt1 =
      'SELECT posts.*, username, first_name, last_name, profile_pic, like_id FROM posts INNER JOIN users ON posts.posted_by = users.user_id LEFT JOIN likes ON likes.post_id = posts.post_id AND likes.user_id = $1 WHERE posted_by = $2'
    const stmt2 = ' ORDER BY posts.post_id desc LIMIT 5'
    let query = null
    const values = [loggedUserId, userId]
    if (current > 0) {
      query = stmt1 + ' AND posts.post_id < $3' + stmt2
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
  const loggedUserId = req.user.id
  try {
    let stmt =
      'INSERT INTO likes (post_id, user_id, liked_on) VALUES ($1, $2, $3) returning like_id'
    let result = await pool.query(stmt, [postId, loggedUserId, Date.now()])
    const resp = { liked: result.rows[0].like_id, likes: 0 }
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

/**
 * Unlike a post
 * @param {*} req
 * @param {*} res
 * @return unlike status | error
 */
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

/**
 * Comment on a post
 * @param req
 * @param res
 * @return new comment | error
 */
const comment = async (req, res) => {
  const { postId, comment } = req.body
  const loggedUserId = req.user.id
  try {
    let stmt =
      'INSERT INTO comments (post_id, user_id, comment, commented_on) VALUES ($1, $2, $3, $4) returning *'
    let result = await pool.query(stmt, [postId, loggedUserId, comment, Date.now()])
    const resp = {
      postId: postId,
      comment_ids: [result.rows[0].comment_id],
      comment: {
        [result.rows[0].comment_id]: {
          comment: result.rows[0].comment,
          author: loggedUserId,
          timestamp: result.rows[0].commented_on
        }
      }
    }
    stmt =
      'UPDATE posts SET comment_count = comment_count + 1 WHERE post_id = $1 RETURNING comment_count'
    result = await pool.query(stmt, [postId])
    resp.comments = result.rows[0].comment_count
    return res.status(200).json({ message: 'Comment created', contents: resp })
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'There was an error while commenting on the post. PLease try again later' })
  }
}

/**
 * Delete a comment
 * @param req
 * @param res
 * @return comment | error
 */
const deleteComment = async (req, res) => {
  const { commentId } = req.body
  try {
    let stmt = 'DELETE FROM comments WHERE comment_id = $1 RETURNING *'
    let result = await pool.query(stmt, [commentId])
    stmt =
      'UPDATE posts SET comment_count = comment_count - 1 WHERE post_id = $1 RETURNING comment_count, post_id'
    result = await pool.query(stmt, [result.rows[0].post_id])
    return res.status(200).json({
      message: 'Comment removed',
      content: { postId: result.rows[0].post_id, comments: result.rows[0].comment_count }
    })
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'There was an error while deleting your comment. PLease try again later' })
  }
}

/**
 * Get all comments of a post
 * @param req
 * @param res
 * @return comments | error
 */
const getComment = async (req, res) => {
  const { postId, current } = req.body
  try {
    let query =
      'SELECT comments.*, first_name, last_name, username, profile_pic FROM comments INNER JOIN users ON users.user_id = comments.user_id WHERE post_id = $1'
    const values = [postId]
    if (current) {
      query += ' AND comment_id < $2 '
      values.push(current)
    }
    query += ' ORDER BY comment_id DESC LIMIT 3'
    const result = await pool.query(query, values)
    const resp = {
      postId: postId,
      commentIds: [],
      comments: {},
      users: {}
    }
    result.rows.forEach((comment) => {
      resp.commentIds.push(comment.comment_id)
      resp.comments[comment.comment_id] = {
        comment: comment.comment,
        author: comment.user_id,
        timestamp: comment.commented_on
      }
      if (!(comment.user_id in resp.users)) {
        resp.users[comment.user_id] = {
          username: comment.username,
          firstname: comment.first_name,
          lastname: comment.last_name,
          avatar: comment.profile_pic
        }
      }
    })
    resp.commentIds.sort((a, b) => a - b)
    return res.status(200).json({ comments: resp })
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'There was an error while getting comment. PLease try again later' })
  }
}

/**
 * Function to delete post
 * @param req
 * @param res
 * @return success message | error
 */
const deletePost = async (req, res) => {
  const { postId } = req.params
  const loggedUserId = req.user.id
  try {
    await pool.query('DELETE FROM posts WHERE post_id = $1 AND posted_by = $2', [
      postId,
      loggedUserId
    ])
    return res.status(200).json({ message: 'Post deleted successfully' })
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'There was an error while deleting the post. PLease try again later' })
  }
}

module.exports = {
  createNewPost,
  getUserPosts,
  likePost,
  unlikePost,
  comment,
  deleteComment,
  getComment,
  deletePost
}
