const roleController = require('../controllers/role');

module.exports = (router) => {
    router.get('/roles', roleController.getRoles);
};
