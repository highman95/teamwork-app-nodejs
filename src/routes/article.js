const articleController = require('../controllers/article');
const auth = require('../middlewares/auth');

module.exports = (router) => {
    router.post('/articles', auth, articleController.createOne);
    router.post('/articles/:articleId/comment', auth, articleController.createPostComment);
    router.patch('/articles/:articleId', auth, articleController.updatePost);
    router.get('/articles/:articleId', auth, articleController.getPost);
    router.delete('/articles/:articleId', auth, articleController.deletePost);
};
