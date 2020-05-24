const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URI })

module.exports = pool
