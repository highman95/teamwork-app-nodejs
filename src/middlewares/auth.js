const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { token = '' } = req.headers;// .authorization.split(' ')[1];
  if (!token || !token.trim()) {
    next(new Error('Token is missing'));
    return;
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '24h', subject: process.env.JWT_SUBJECT, issuer: process.env.JWT_ISSUER });
    req.userId = decodedToken.userId;
    next();
  } catch (e) {
    next(new Error(`Token is ${(e.name === 'TokenExpiredError') ? 'expired' : 'invalid'}`));
  }
};

module.exports = auth;
