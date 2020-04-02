const Multer = require('multer')
const { v4 } = require('uuid')
const path = require('path')

const storage = Multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, 'uploads/')
  },
  filename: function(req, file, callback) {
    callback(null, v4() + path.extname(file.originalname))
  }
})

const limits = {
  fileSize: 1024 * 1024 * 5
}

const fileFilter = function(req, file, callback) {
  const allowedTypes = ['image/jpg', 'image/jpeg']
  if (!allowedTypes.includes(file.mimetype)) {
    callback(new Error('Invalid file type'), false)
  }
  callback(null, true)
}

module.exports = new Multer({ storage, fileFilter, limits })
