const userController = require('../controllers/user');

module.exports = (router) => {
    router.post('/auth/create-user', userController.createOne);
};
