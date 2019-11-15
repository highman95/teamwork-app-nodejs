const departmentController = require('../controllers/department');
const auth = require('../middlewares/auth');

module.exports = (router) => {
    router.get('/departments', auth, departmentController.getDepartments);
};
