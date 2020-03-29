const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const { token = '' } = req.headers;
    if (!token || !token.trim()) {
        next(new Error('Token is missing'));
        return;
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.userId;
        next();
    } catch (e) {
        next(new Error('Token is invalid'));
    }
};

module.exports = auth;
