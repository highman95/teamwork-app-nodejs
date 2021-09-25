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

  // set a default PING / Health-Check route
  router.get('/ping', (req, res) => res.json({ status: 'success', error: 'Page Pongs...' }));

  // set a default route
  router.use('*', (req, res, next) => next(new ReferenceError('Page no longer exists')));
  return router;
};
