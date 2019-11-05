const article_routes = require('./article');
const gif_routes = require('./gif');
const user_routes = require('./user');

module.exports = (router) => {
    article_routes(router);
    gif_routes(router);
    user_routes(router);

    return router;
};
