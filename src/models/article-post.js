const modelPost = require('./post');

module.exports = {
  create: async (title, content, userId) => {
    if (!content || !content.trim()) throw new Error('Content is missing'); // 400

    return modelPost.create(
      modelPost.types.ARTICLE_POST,
      title,
      content,
      null,
      userId
    );
  },

  update: async (id, title, content) => {
    if (!content || !content.trim()) throw new Error('Content is missing'); // 400
    return modelPost.update(modelPost.types.ARTICLE_POST, id, title, content);
  },

  delete: async (id) => modelPost.delete(modelPost.types.ARTICLE_POST, id),

  find: async (id) => modelPost.find(modelPost.types.ARTICLE_POST, id),
};
