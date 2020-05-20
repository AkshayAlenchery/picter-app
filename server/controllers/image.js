const { imageUpload, deleteImage } = require('../services/Image')
const { promisify } = require('util')

/**
 * Upload images and return the urls
 * @param req
 * @param res
 * @return file URL's | error
 */
const uploadImages = async (req, res) => {
  const uploader = promisify(imageUpload().array('images', 10))
  try {
    await uploader(req, res)
    if (!req.files.length) {
      return res.status(400).json({ message: 'Please select files to upload' })
    }
    const files = req.files.map((file) => file.location)
    return res.status(200).json({ message: 'Uploaded files', images: files })
  } catch (err) {
    console.log(err)
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
 * Delete an image
 * @param req
 * @param res
 * @returns success msg | error
 */
const deleteImages = async (req, res) => {
  const result = await deleteImage(req.params.image)
  if (result) return res.status(200).json({ message: 'File removed!' })
  return res.status(500).json({ message: 'There was an error. Failed to delete.' })
}

module.exports = { uploadImages, deleteImages }
