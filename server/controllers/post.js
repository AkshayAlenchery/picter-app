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
      'INSERT INTO posts (caption, image_urls, posted_by, posted_on) VALUES ($1, $2, $3, $4) RETURNING post_id AS id, caption AS title, image_urls AS images, posted_on AS created_at, like_count AS likes, comment_count AS comments'
    const values = [caption, images, userId, Date.now()]
    const result = await pool.query(query, values)
    return res.status(200).json({ message: 'Added new post', post: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to upload. There was an error.' })
  }
}

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

module.exports = { createNewPost, uploadImages, deleteImage }
