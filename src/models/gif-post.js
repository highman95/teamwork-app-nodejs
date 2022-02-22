const mediaManager = require('../configs/cloudinary');
const modelPost = require('./post');

module.exports = {
  create: async (title, imageFile, userId) => {
    if (!imageFile || !imageFile.path || !imageFile.path.trim()) {
      throw new Error('GIF image is missing'); // 400
    }

    let response;
    try {
      response = await mediaManager.uploadImage(imageFile.path);

      // delete the file and save the cloudStorage info
      // await fs.unlink(file.path);
    } catch (e) {
      // console.error('[Cloudinary] Error: ', e.message || e.error.message);
      throw new Error('GIF image could not uploaded (Cloud)'); // 500
    }

    return modelPost.create(
      modelPost.types.GIF_POST,
      title,
      null,
      response.url,
      userId
    );
  },

  delete: async (id) => modelPost.delete(modelPost.types.GIF_POST, id),

  find: async (id) => modelPost.find(modelPost.types.GIF_POST, id),
};
