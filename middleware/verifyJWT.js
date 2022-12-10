const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: "Auth header not found",
    });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "Invalid token",
      }); //invalid token

    if (!decoded.userId || !decoded.email)
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "Invalid token user id not found",
      }); //invalid token

    req.users = { userId: decoded.userId, email: decoded.email };
    console.log("verified", req.users, decoded);
    next();
  });
};

module.exports = verifyJWT;
