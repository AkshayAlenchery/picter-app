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
    const userDetails = await pool.query(
      'SELECT user_id, first_name, last_name, email_address, followers, following FROM users WHERE username = $1',
      [username]
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
      emailId: userDetails.rows[0].email_address,
      followers: userDetails.rows[0].followers,
      following: userDetails.rows[0].following
    }
    return res.status(200).json({ user: resp })
  } catch (err) {
    return res.status(200).json({ message: 'There was an error. Please try again later' })
  }
}

module.exports = { getUserDetails }
