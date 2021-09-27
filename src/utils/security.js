const jwt = require('jsonwebtoken');

module.exports.generateToken = (user) => jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: '24h',
  subject: process.env.JWT_SUBJECT,
  issuer: process.env.JWT_ISSUER,
});

module.exports.verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
