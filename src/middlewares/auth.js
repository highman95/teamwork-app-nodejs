const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const { token } = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (req.body.userId && req.body.userId !== decodedToken.userId) {
            throw new Error('Token verification failed');
        } else {
            next();
        }
    } catch (error) {
        res.status(400).json({ status: 'error', error });
    }
};
