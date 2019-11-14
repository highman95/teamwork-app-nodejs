const articleController = require('../controllers/article');
const auth = require('../middlewares/auth');

module.exports = (router) => {
    router.post('/articles', auth, articleController.createOne);
    router.get('/articles/:articleId', auth, articleController.getPost);
};
