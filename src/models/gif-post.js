const mediaManager = require('../configs/cloudinary');
const modelPost = require('./post');
const postTypeId = 1;

module.exports = {
    create: async (title, imageFile, userId) => {
        if (!imageFile || !imageFile.path.trim()) throw new Error('GIF image is missing');//400

        let response;
        try {
            response = await mediaManager.uploadImage(imageFile.path);

            // delete the file and save the cloudStorage info
            // await fs.unlink(file.path);
        } catch (e) {
            // console.error('[Cloudinary] Error: ', e.message || e.error.message);
            throw new Error('GIF image could not uploaded (Cloud)');//500
        }

        return await modelPost.create(postTypeId, title, null, response.url, userId);
    },

    delete: async (id) => await modelPost.delete(postTypeId, id),

    find: async (id) => await modelPost.find(postTypeId, id)
}

