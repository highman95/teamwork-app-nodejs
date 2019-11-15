const userController = require('../controllers/user');
const auth = require('../middlewares/auth');

module.exports = (router) => {
    router.post('/auth/create-user', auth, userController.createOne);
    router.post('/auth/signin', userController.signIn);
};
