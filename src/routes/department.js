const controller = require('../controllers/department');

module.exports = (router) => {
  router.get('/departments', controller.getDepartments);
};
