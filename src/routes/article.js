const controller = require('../controllers/article');
const auth = require('../middlewares/auth');

module.exports = (router) => {
  router.post('/articles', auth, controller.createPost);
  router.post(
    '/articles/:articleId/comment',
    auth,
    controller.createPostComment
  );
  router.patch('/articles/:articleId', auth, controller.updatePost);
  router.get('/articles/:articleId', auth, controller.getPost);
  router.delete('/articles/:articleId', auth, controller.deletePost);
};
