const articleController = require('../controllers/article');

module.exports = (router) => {
    router.get('/', (req, res) => {
        res.status(200).json({ message: 'Teamwork makes the DREAM work...' });
    });
};
