const feedController = require('../controllers/feed');
const auth = require('../middlewares/auth');

module.exports = router => {
    router.get('/feed', auth, feedController.getPosts);
};