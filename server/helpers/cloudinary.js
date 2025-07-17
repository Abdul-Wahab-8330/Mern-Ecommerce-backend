const cloudinary = require('cloudinary').v2;
const multer = require('multer')

cloudinary.config({ 
  cloud_name: 'dovw5pve4', 
  api_key: '615296839213246', 
  api_secret: '9DZS8QPqsOZbgdQFyVM_f30tKTo'
});

const storage = new multer.memoryStorage()

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file,{
    resource_type:'auto'
  }) 
  return result;
}

const upload = multer({storage})
module.exports = {upload, imageUploadUtil}