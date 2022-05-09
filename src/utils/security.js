const { sign, verify, TokenExpiredError } = require('jsonwebtoken');

const options = {
  expiresIn: '24h',
  subject: process.env.JWT_SUBJECT,
  issuer: process.env.JWT_ISSUER,
};

exports.generateToken = (user) => {
  return sign({ userId: user.id }, process.env.JWT_SECRET, options);
};

exports.verifyToken = (token) => {
  return verify(token, process.env.JWT_SECRET, options);
};

exports.TokenExpiredError = TokenExpiredError;
