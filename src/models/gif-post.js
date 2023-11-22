const mediaManager = require('../configs/cloudinary');
const modelPost = require('./post');

exports.create = async (title, imageFile, userId) => {
  if (!imageFile?.path?.trim()) {
    throw new Error('GIF image is missing'); // 400
  }

  let response;
  try {
    response = await mediaManager.uploadImage(imageFile.path);

    // delete the file and save the cloudStorage info
    // await fs.unlink(file.path);
  } catch (e) {
    console.error('[Cloudinary] Error: ', e.message || e.error.message);
    throw new Error('GIF image could not uploaded (Cloud)'); // 500
  }

  return modelPost.create(
    modelPost.types.GIF_POST,
    title,
    null,
    response.url,
    userId
  );
};

exports.delete = async (id) => {
  return modelPost.delete(modelPost.types.GIF_POST, id);
};

exports.find = async (id) => {
  return modelPost.find(modelPost.types.GIF_POST, id);
};
