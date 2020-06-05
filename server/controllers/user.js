const pool = require('../db/')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * Function to get user details
 * @param req
 * @param res
 * @return User details | error
 */
const getUserDetails = async (req, res) => {
  try {
    const { username } = req.params
    const loggedUserId = req.user.id
    const userDetails = await pool.query(
      'SELECT user_id, username, first_name, last_name, bio, profile_pic, followers, following, registered_on, follower_id FROM users LEFT JOIN followers ON followers.follower_user = $2 AND followers.following_user = users.user_id  WHERE username = $1',
      [username, loggedUserId]
    )
    if (userDetails.rowCount === 0) return res.status(404).json({ message: 'User not found' })
    const resp = {
      user: {},
      following: [],
      followers: [],
      users: {}
    }
    resp.user = {
      id: userDetails.rows[0].user_id,
      firstname: userDetails.rows[0].first_name,
      lastname: userDetails.rows[0].last_name,
      username: username,
      bio: userDetails.rows[0].bio,
      followers: userDetails.rows[0].followers,
      following: userDetails.rows[0].following,
      avatar: userDetails.rows[0].profile_pic,
      isFollowing: userDetails.rows[0].follower_id || false,
      registeredOn: userDetails.rows[0].registered_on
    }
    return res.status(200).json({ user: resp })
  } catch (err) {
    return res.status(500).json({ message: 'There was an error. Please try again later' })
  }
}

/**
 * Function to follow user
 * @param req
 * @param res
 * @return {result} || error
 */
const followUser = async (req, res) => {
  const loggedUserId = req.user.id
  const { followedUser } = req.body
  try {
    const followUser = await pool.query(
      'INSERT INTO followers (follower_user, following_user, followed_on) VALUES ($1, $2, $3) RETURNING *',
      [loggedUserId, followedUser, Date.now()]
    )
    const followingCount = await pool.query(
      'UPDATE users SET following = following + 1 WHERE user_id = $1 RETURNING first_name, last_name, username, profile_pic, following',
      [loggedUserId]
    )
    const followerCount = await pool.query(
      'UPDATE users SET followers = followers + 1 WHERE user_id = $1 RETURNING followers',
      [followedUser]
    )
    const resp = {
      followerId: followedUser,
      followerCount: followerCount.rows[0].followers,
      followers: [loggedUserId],
      users: {
        [loggedUserId]: {
          firstname: followingCount.rows[0].first_name,
          lastname: followingCount.rows[0].last_name,
          username: followingCount.rows[0].username,
          avatar: followingCount.rows[0].profile_pic,
          count: followingCount.rows[0].following
        }
      },
      isFollowing: followUser.rows[0].follower_id
    }
    res.status(200).json(resp)
  } catch (err) {
    return res.status(500).json({ message: 'There was an error. Please try again later' })
  }
}

/**
 * Function to unfollow user
 * @param req
 * @param res
 * @return {result} || error
 */
const unFollowUser = async (req, res) => {
  const { followId } = req.params
  try {
    const unfollowUser = await pool.query(
      'DELETE FROM followers WHERE follower_id = $1 RETURNING *',
      [followId]
    )
    const followingCount = await pool.query(
      'UPDATE users SET following = following - 1  WHERE user_id = $1 RETURNING following',
      [unfollowUser.rows[0].follower_user]
    )
    const followerCount = await pool.query(
      'UPDATE users SET followers = followers - 1 WHERE user_id = $1 RETURNING followers',
      [unfollowUser.rows[0].following_user]
    )
    const resp = {
      followerCount: followerCount.rows[0].followers,
      unFollower: unfollowUser.rows[0].follower_user,
      isFollowing: false
    }
    res.status(200).json(resp)
  } catch (err) {
    return res.status(500).json({ message: 'There was an error. Please try again later' })
  }
}

/**
 * Get follower details
 * @param req
 * @param res
 * @result {followers} || error
 */
const getFollowers = async (req, res) => {
  const { userId } = req.params
  const { current } = req.body
  try {
    const stmt1 =
      'SELECT followers.*, first_name, last_name, username, profile_pic FROM followers INNER JOIN users ON follower_user = users.user_id WHERE following_user = $1 '
    const stmt2 = ' ORDER BY follower_id DESC LIMIT 100'
    let query = ''
    const values = [userId]
    if (current) {
      query = stmt1 + ' AND follower_id < $2' + stmt2
      values.push(current)
    } else query = stmt1 + stmt2
    const result = await pool.query(query, values)
    if (!result.rowCount) return res.status(200).json({ followers: [], users: {} })
    const resp = {
      followers: [],
      users: {}
    }
    result.rows.forEach((row) => {
      resp.followers.push(row.follower_user)
      resp.users[row.follower_user] = {
        firstname: row.first_name,
        lastname: row.last_name,
        username: row.username,
        avatar: row.profile_pic
      }
    })
    return res.status(200).json(resp)
  } catch (err) {
    return res.status(500).json({ message: 'There was an error. Please try again later' })
  }
}

/**
 * Get following details
 * @param req
 * @param res
 * @return {following} || error
 */
const getFollowing = async (req, res) => {
  const { userId } = req.params
  const { current } = req.body
  try {
    const stmt1 =
      'SELECT followers.*, first_name, last_name, username, profile_pic FROM followers INNER JOIN users ON following_user = users.user_id WHERE follower_user = $1 '
    const stmt2 = ' ORDER BY follower_id DESC LIMIT 100'
    let query = ''
    const values = [userId]
    if (current) {
      query = stmt1 + ' AND follower_id < $2' + stmt2
      values.push(current)
    } else query = stmt1 + stmt2
    const result = await pool.query(query, values)
    if (!result.rowCount) return res.status(200).json({ following: [], users: {} })
    const resp = {
      following: [],
      users: {}
    }
    result.rows.forEach((row) => {
      resp.following.push(row.following_user)
      resp.users[row.following_user] = {
        firstname: row.first_name,
        lastname: row.last_name,
        username: row.username,
        avatar: row.profile_pic
      }
    })
    return res.status(200).json(resp)
  } catch (err) {
    return res.status(500).json({ message: 'There was an error. Please try again later' })
  }
}

/**
 * Update profile information
 * @param req
 * @param res
 * @return {user} || error
 */
const updateProfile = async (req, res) => {
  const updatedData = req.body
  const loggedUserId = req.user.id
  const columns = {
    username: 'username',
    firstname: 'first_name',
    lastname: 'last_name',
    avatar: 'profile_pic',
    bio: 'bio'
  }
  try {
    let update = ''
    const values = [loggedUserId]
    Object.keys(updatedData).forEach((field, index) => {
      if (index) update += ','
      update += `${columns[field]} = $${index + 2}`
      values.push(updatedData[field])
    })
    const query =
      'UPDATE users SET ' +
      update +
      ' WHERE user_id = $1 RETURNING username, first_name, last_name, profile_pic, bio'
    const result = await pool.query(query, values)
    return res.status(200).json({
      id: loggedUserId,
      username: result.rows[0].username,
      firstname: result.rows[0].first_name,
      lastname: result.rows[0].last_name,
      avatar: result.rows[0].profile_pic,
      bio: result.rows[0].bio
    })
  } catch (err) {
    return res.status(500).json({ message: 'There was an error. Please try again later' })
  }
}

/**
 * Search user
 * @param req
 * @param res
 * @return [users] | error
 */
const searchUser = async (req, res) => {
  const { name, current } = req.params
  try {
    const result = await pool.query(
      'SELECT user_id as id, username, first_name as firstname, last_name as lastname, profile_pic as avatar, bio FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1 AND user_id > $2 ORDER BY user_id ASC LIMIT 20',
      [`%${name}%`, current]
    )
    res.status(200).json(result.rows)
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'There was an error while searching. Please try again later' })
  }
}

/**
 * Register a new user
 * @param req
 * @param res
 * @return success | error
 */
const registerUser = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body
  try {
    const checkUsername = await pool.query('SELECT user_id FROM users WHERE username = $1', [
      username
    ])
    if (checkUsername.rowCount > 0) {
      return res
        .status(409)
        .json({ message: 'The username already exist. Please try with a different username.' })
    }
    const checkEmail = await pool.query('SELECT user_id FROM users WHERE email_address = $1', [
      email
    ])
    if (checkEmail.rowCount > 0) {
      return res.status(409).json({
        message: 'The email address already exists. Please try with a different email address'
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await pool.query(
      'INSERT INTO USERS (first_name, last_name, username, email_address, password, registered_on) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id',
      [firstname, lastname, username, email, hashedPassword, Date.now()]
    )

    const resp = {
      accessToken: '',
      user: {
        id: user.rows[0].user_id,
        username: username,
        firstname: firstname,
        lastname: lastname
      }
    }
    resp.accessToken = jwt.sign({ user: user.rows[0].user_id }, process.env.JWT_PRIVATE, {
      expiresIn: '3 days'
    })
    return res.status(200).json(resp)
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'There was an error while registering. Please try again later' })
  }
}

/**
 * Login user
 * @param req
 * @param rep
 * @result {jwt} | error
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const checkUser = await pool.query(
      'SELECT user_id, username, password, first_name, last_name, profile_pic FROM users WHERE email_address = $1',
      [email]
    )
    if (!checkUser.rowCount) {
      return res.status(404).json({ message: 'User not found. Please register and try again.' })
    }
    const checkPass = await bcrypt.compare(password, checkUser.rows[0].password)
    if (!checkPass) {
      return res
        .status(401)
        .json({ message: 'Email / password doesnot match. Please try again later' })
    }
    const resp = {
      accessToken: '',
      user: {
        id: checkUser.rows[0].user_id,
        username: checkUser.rows[0].username,
        firstname: checkUser.rows[0].first_name,
        lastname: checkUser.rows[0].last_name
      }
    }
    resp.accessToken = jwt.sign({ user: checkUser.rows[0].user_id }, process.env.JWT_PRIVATE, {
      expiresIn: '3 days'
    })
    return res.status(200).json(resp)
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'There was an error while logging in. Please try again later' })
  }
}

/**
 * Check user
 * @param req
 * @param res
 * @return {user} | error
 */
const checkUser = async (req, res) => {
  try {
    const checkUser = await pool.query(
      'SELECT user_id as id, username, first_name as firstname, last_name as lastname, profile_pic as avatar FROM users WHERE user_id = $1',
      [req.user.id]
    )
    if (!checkUser.rowCount) return res.status(404).json({ message: 'User not found' })
    return res.status(200).json(checkUser.rows[0])
  } catch (err) {
    return res.status(500).json({ message: 'There was an error. Please try again later' })
  }
}

/**
 * Change password
 * @param req
 * @param res
 * @return success | error
 */
const changePassword = async (req, res) => {
  const { password, newPassword } = req.body
  const loggedUserId = req.user.id
  try {
    const getPassword = await pool.query('SELECT password FROM users WHERE user_id = $1', [
      loggedUserId
    ])
    const checkPass = await bcrypt.compare(password, getPassword.rows[0].password)
    if (!checkPass) {
      return res.status(401).json({ message: 'Password doesnot match. Please try again later' })
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE users SET password = $2 WHERE user_id = $1', [
      loggedUserId,
      newHashedPassword
    ])
    return res.status(200).json({ message: 'Password updated successfully' })
  } catch (err) {
    return res.status(500).json({ message: 'There was an error. Please try again later' })
  }
}

/**
 * Get news feed
 * @param req
 * @param res
 * @return {feed} | error
 */
const getFeed = async (req, res) => {
  const loggedUserId = req.user.id
  const { current } = req.body
  try {
    const stmt1 =
      '(SELECT posts.*, username, first_name, last_name, profile_pic, like_id FROM posts INNER JOIN users ON posts.posted_by = users.user_id LEFT JOIN likes ON likes.post_id = posts.post_id AND likes.user_id = $1 WHERE posts.posted_by IN (SELECT following_user FROM followers WHERE follower_user = $1 UNION SELECT $1 as following_user)'
    const stmt2 = ' ORDER BY posts.post_id DESC LIMIT 5)'
    let query
    const values = [loggedUserId]
    if (current > 0) {
      query = stmt1 + ' AND posts.post_id < $2' + stmt2
      values.push(current)
    } else query = stmt1 + stmt2
    const result = await pool.query(query, values)
    console.log(result.rows)
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

module.exports = {
  getUserDetails,
  followUser,
  unFollowUser,
  getFollowers,
  getFollowing,
  updateProfile,
  searchUser,
  registerUser,
  loginUser,
  checkUser,
  changePassword,
  getFeed
}
