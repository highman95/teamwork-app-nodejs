const departmentController = require('../controllers/department');

module.exports = (router) => {
    router.get('/departments', departmentController.getDepartments);
};
