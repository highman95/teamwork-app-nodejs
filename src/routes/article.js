const articleController = require('../controllers/article');
const auth = require('../middlewares/auth');

module.exports = (router) => {
    router.post('/articles', auth, articleController.createOne);
    router.post('/articles/:articleId/comment', auth, articleController.createPostComment);
    router.get('/articles/:articleId', auth, articleController.getPost);
};
