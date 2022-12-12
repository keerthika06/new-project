const jwt = require("jsonwebtoken");

const checkUserIsLoggedIn = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  if (!authHeader) return next(); // he is not logged in
  //   console.log(authHeader);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "User Token is expired / Invalid token",
      }); //invalid token

    if (!decoded.userId || !decoded.email)
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "Token there but Invalid token user id not found",
      }); //invalid token

    req.users = { userId: decoded.userId, email: decoded.email };
    console.log("verified", req.users, decoded);
    next();
  });
};

module.exports = checkUserIsLoggedIn;
