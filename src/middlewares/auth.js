const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const { token } = req.headers;
        if (token === undefined || token === '') {
            throw new Error('Token must be provided');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (req.body.userId && req.body.userId !== decodedToken.userId) {
            throw new Error('Token verification failed');
        }

        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
};
