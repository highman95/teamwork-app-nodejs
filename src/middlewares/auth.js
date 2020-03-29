const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const { token } = req.headers;
    if (!token || token === '') {
        next(new Error('Token is missing'));
        return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (req.body.userId && req.body.userId !== decodedToken.userId) {
        next(new Error('Token verification failed'));
        return;
    }

    req.userId = decodedToken.userId;
    next();
};

module.exports = auth;
