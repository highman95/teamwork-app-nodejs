const { verifyToken, TokenExpiredError } = require("../utils/security");

module.exports = (req, _res, next) => {
  const { token = "" } = req.headers; // .authorization.split(' ')[1];
  if (!token?.trim()) {
    next(new Error("Token is missing"));
    return;
  }

  try {
    const decodedToken = verifyToken(token);
    req.userId = decodedToken.userId;
    next();
  } catch (e) {
    next(
      new Error(
        `Token is ${e.name === TokenExpiredError.name ? "expired" : "invalid"}`
      )
    );
  }
};
