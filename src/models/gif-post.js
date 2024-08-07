const fs = require("fs/promises");
const mediaManager = require("../configs/cloudinary");
const modelPost = require("./post");

exports.create = async (title, imageFile, userId) => {
  if (!imageFile?.path?.trim()) {
    throw new Error("GIF image is missing"); // 400
  }

  let response;
  try {
    const isTestEnv =
      process.env.NODE_ENV === "test" || process.env.NODE_ENV === "undefined";

    response = isTestEnv
      ? { url: "https://" }
      : await mediaManager.uploadImage(imageFile.path);

    // delete the file and save the cloudStorage info
    await fs.unlink(imageFile.path);
  } catch (e) {
    console.error("[Cloudinary] Error: ", e.message || e.error.message);
    throw new Error("GIF image could not uploaded (Cloud)"); // 500
  }

  return modelPost.create(
    modelPost.types.GIF_POST,
    title,
    null,
    response.url,
    userId
  );
};

exports.delete = async (id) => modelPost.delete(modelPost.types.GIF_POST, id);

exports.find = async (id) => modelPost.find(modelPost.types.GIF_POST, id);
