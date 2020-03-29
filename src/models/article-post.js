const modelPost = require('./post');

const postTypeId = 2;

module.exports = {
    create: async (title, content, userId) => {
        if (!content || !content.trim()) throw new Error('Content is missing');// 400
        return modelPost.create(postTypeId, title, content, null, userId);
    },

    update: async (id, title, content) => {
        if (!content || !content.trim()) throw new Error('Content is missing');// 400
        return modelPost.update(postTypeId, id, title, content);
    },

    delete: async (id) => modelPost.delete(postTypeId, id),

    find: async (id) => modelPost.find(postTypeId, id),
};
