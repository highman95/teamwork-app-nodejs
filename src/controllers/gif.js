const modelPost = require("../models/gif-post");
const modelComment = require("../models/comment");

exports.createPost = async (req, res, next) => {
  const {
    body: { title },
    file,
    userId,
  } = req;

  try {
    const post = await modelPost.create(title, file, userId);
    const { id: gifId, image_url: imageUrl, created_at: createdOn } = post;

    res.status(201).json({
      status: "success",
      data: {
        message: "GIF image successfully posted",
        imageUrl,
        gifId,
        title,
        createdOn,
      },
    });
  } catch (e) {
    next(e);
  }
};

/**
 * Register a comment for a specific gif post
 *
 * @author Emma Nwamaife
 *
 * @param req The httpRequest Object
 * @param res The httpResponse object
 * @returns The httpResponse object
 */
exports.createPostComment = async (req, res, next) => {
  const {
    params: { gifId },
    body: { comment },
    userId,
  } = req;

  try {
    const post = await modelPost.find(gifId);
    const postComment = await modelComment.create(post.id, comment, userId);

    const { title: gifTitle } = post;
    const { created_at: createdOn } = postComment;

    res.status(201).json({
      status: "success",
      data: {
        message: "Comment successfully created",
        createdOn,
        gifTitle,
        comment,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.getPost = async (req, res, next) => {
  const {
    params: { gifId },
  } = req;

  try {
    const post = await modelPost.find(gifId);
    let comments = await modelComment.fetchAll(post.id);

    comments = comments.map(
      ({ id: commentId, comment, user_id: authorId }) => ({
        commentId,
        comment,
        authorId,
      })
    );
    const { id, title, image_url: url, created_at: createdOn } = post;

    res.status(200).json({
      status: "success",
      data: {
        id,
        createdOn,
        title,
        url,
        comments,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.deletePost = async (req, res, next) => {
  const {
    params: { gifId },
  } = req;

  try {
    await modelPost.delete(gifId);
    res.status(200).json({
      status: "success",
      data: {
        message: "GIF post successfully deleted",
      },
    });
  } catch (e) {
    next(e);
  }
};
