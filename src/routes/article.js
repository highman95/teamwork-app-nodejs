const articleController = require('../controllers/article');

module.exports = (router) => {
    router.post('/articles', articleController.createOne);
};
