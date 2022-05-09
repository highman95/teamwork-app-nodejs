const modelPost = require('../models/article-post');
const modelComment = require('../models/comment');

exports.createPost = async (req, res, next) => {
  const {
    body: { title, article },
    userId,
  } = req;

  try {
    const post = await modelPost.create(title, article, userId);
    const { id: articleId, created_at: createdOn } = post;

    res.status(201).json({
      status: 'success',
      data: {
        message: 'Article successfully posted',
        articleId,
        title,
        createdOn,
      },
    });
  } catch (e) {
    next(e);
  }
};

/**
 * Register a comment for a single article post
 *
 * @author Emma Nwamaife
 *
 * @param req The httpRequest Object
 * @param res The httpResponse object
 * @returns The httpResponse object
 */
exports.createPostComment = async (req, res, next) => {
  const {
    params: { articleId },
    body: { comment },
    userId,
  } = req;

  try {
    const post = await modelPost.find(articleId);
    const postComment = await modelComment.create(post.id, comment, userId);

    const { title: articleTitle, content: article } = post;
    const { created_at: createdOn } = postComment;

    res.status(201).json({
      status: 'success',
      data: {
        message: 'Comment successfully created',
        createdOn,
        articleTitle,
        article,
        comment,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.updatePost = async (req, res, next) => {
  const {
    params: { articleId },
    body: { title, article },
  } = req;

  try {
    const post = await modelPost.find(articleId);
    await modelPost.update(post.id, title, article);

    res.status(200).json({
      status: 'success',
      data: {
        message: 'Article successfully updated',
        title,
        article,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.getPost = async (req, res, next) => {
  const {
    params: { articleId },
  } = req;

  try {
    const post = await modelPost.find(articleId);
    let comments = await modelComment.fetchAll(post.id);

    comments = comments.map(
      ({ id: commentId, comment, user_id: authorId }) => ({
        commentId,
        comment,
        authorId,
      })
    );
    const { id, title, content: article, created_at: createdOn } = post;

    res.status(200).json({
      status: 'success',
      data: {
        id,
        createdOn,
        title,
        article,
        comments,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.deletePost = async (req, res, next) => {
  const {
    params: { articleId },
  } = req;

  try {
    await modelPost.delete(articleId);
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Article successfully deleted',
      },
    });
  } catch (e) {
    next(e);
  }
};
