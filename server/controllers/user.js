const pool = require('../db/')

/**
 * Function to get user details
 * @param req
 * @param res
 * @return User details | error
 */
const getUserDetails = async (req, res) => {
  try {
    const { username } = req.params
    const loggedUserId = 1
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
  const loggedUserId = 1
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
  console.log('following')
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
  const loggedUserId = 1
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
    console.log(query)
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
    console.log(err)
    return res
      .status(500)
      .json({ message: 'There was an error while searching. Please try again later' })
  }
}

module.exports = {
  getUserDetails,
  followUser,
  unFollowUser,
  getFollowers,
  getFollowing,
  updateProfile,
  searchUser
}
