const modelPost = require("./post");

exports.create = async (title, content, userId) => {
  if (!content?.trim()) throw new Error("Content is missing"); // 400

  return modelPost.create(
    modelPost.types.ARTICLE_POST,
    title,
    content,
    null,
    userId
  );
};

exports.update = async (id, title, content) => {
  if (!content?.trim()) throw new Error("Content is missing"); // 400
  return modelPost.update(modelPost.types.ARTICLE_POST, id, title, content);
};

exports.delete = async (id) => {
  return await modelPost.delete(modelPost.types.ARTICLE_POST, id);
};

exports.find = async (id) => modelPost.find(modelPost.types.ARTICLE_POST, id);
