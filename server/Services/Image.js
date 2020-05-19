const Multer = require('multer')
const { v4 } = require('uuid')
const path = require('path')
const AWS = require('aws-sdk')
const MulterS3 = require('multer-s3')
const dotenv = require('dotenv')

dotenv.config()

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

const s3 = new AWS.S3()

const storage = MulterS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET,
  acl: 'public-read',
  key: function (req, file, callback) {
    callback(null, v4() + path.extname(file.originalname))
  }
})

const limits = {
  fileSize: 1024 * 1024 * 5
}

const fileFilter = function (req, file, callback) {
  const allowedTypes = ['image/jpg', 'image/jpeg']
  if (!allowedTypes.includes(file.mimetype)) {
    callback(new Error('Invalid file type'), false)
  }
  callback(null, true)
}

/**
 * Function to upload images
 */
const imageUpload = () => {
  return new Multer({ storage, fileFilter, limits })
}

/**
 * Function to delete images
 * @param file
 * @return true | false
 */
const deleteImage = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: file
  }
  try {
    const result = await s3
      .deleteObject(params, function (err, data) {
        if (err) return err
        else return data
      })
      .promise()
    console.log('Resp: ', result)
    return true
  } catch (err) {
    console.log('Error: ', err)
    return false
  }
}

module.exports = { imageUpload, deleteImage }
