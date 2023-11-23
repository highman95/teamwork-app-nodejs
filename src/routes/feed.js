const controller = require("../controllers/feed");
const auth = require("../middlewares/auth");

module.exports = (router) => {
  router.get("/feed", auth, controller.getPosts);
};
