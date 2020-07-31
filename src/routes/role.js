const controller = require('../controllers/role');

module.exports = (router) => {
    router.get('/roles', controller.getRoles);
};
