const controller = require('../controllers/user');

module.exports = (router) => {
  router.post('/auth/create-user', controller.createOne);
  router.post('/auth/signin', controller.signIn);
};
