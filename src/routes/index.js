const articleRoutes = require('./article');
const gifRoutes = require('./gif');
const userRoutes = require('./user');
const feedRoutes = require('./feed');
const roleRoutes = require('./role');
const departmentRoutes = require('./department');

module.exports = (router) => {
    articleRoutes(router);
    gifRoutes(router);
    userRoutes(router);
    feedRoutes(router);
    roleRoutes(router);
    departmentRoutes(router);

    return router;
};
