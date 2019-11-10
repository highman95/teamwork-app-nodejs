const articleRoutes = require('./article');
const gifRoutes = require('./gif');
const userRoutes = require('./user');

module.exports = (router) => {
    articleRoutes(router);
    gifRoutes(router);
    userRoutes(router);

    return router;
};
