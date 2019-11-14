const gifController = require('../controllers/gif');
const multerWare = require('../middlewares/multer');

module.exports = (router) => {
    router.post('/gifs', multerWare, gifController.createPost);
};
