const UploadImages = require('../middlewares/imageUpload')
const pool = require('../db')

// Function to add a new post
async function addNewPost(req, res) {
  const { caption, images } = req.body
  const userId = 1
  try {
    const query =
      'INSERT INTO posts (caption, image_urls, posted_by, posted_on) VALUES ($1, $2, $3, $4) returning *'
    const resp = await pool.query(query, [caption, images, userId, Date.now()])
    res.status(200).json({ message: 'Posted successfully!', post: resp.rows[0] })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'There was an error at our end. Please try again later' })
  }
}

// Function to upload images
function uploadImages(req, res) {
  const upload = UploadImages.array('images', 10)
  upload(req, res, function(err) {
    if (req.files.length === 0) {
      return res.status(400).json({ message: 'Please select valid (JPG, JPEG) files to upload' })
    }
    if (err) return res.status(400).json({ message: 'Cannot upload files. Please try again.' })
    return res.status(200).json({
      message: 'Uploaded!',
      images: req.files.map(
        file => `http://localhost:${process.env.APP_PORT}/image/${file.originalname}`
      )
    })
  })
}

module.exports = { addNewPost, uploadImages }
