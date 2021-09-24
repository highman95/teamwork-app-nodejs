const controller = require('../controllers/gif');
const auth = require('../middlewares/auth');
const multerWare = require('../middlewares/multer');

module.exports = (router) => {
  router.post('/gifs', auth, multerWare, controller.createPost);
  router.post('/gifs/:gifId/comment', auth, controller.createPostComment);
  router.get('/gifs/:gifId', auth, controller.getPost);
  router.delete('/gifs/:gifId', auth, controller.deletePost);
};
