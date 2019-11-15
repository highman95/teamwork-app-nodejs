const roleController = require('../controllers/role');
const auth = require('../middlewares/auth');

module.exports = (router) => {
    router.get('/roles', auth, roleController.getRoles);
};
