const gifController = require('../controllers/gif');
const auth = require('../middlewares/auth');
const multerWare = require('../middlewares/multer');

module.exports = (router) => {
    router.post('/gifs', auth, multerWare, gifController.createPost);
    router.post('/gifs/:gifId/comment', auth, gifController.createPostComment);
    router.get('/gifs/:gifId', auth, gifController.getPost);
};
