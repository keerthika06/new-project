const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
const { internalServerError } = require("../utils/commonErrors");
const JWT_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

const handleRefreshToken = async (req, res) => {
  try {
    const refreshHeader = req.headers["refresh-token"];

    if (!refreshHeader)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Refresh header not found",
      });

    const refreshToken = refreshHeader;

    User.findOne({ refreshToken }, async (err, docs) => {
      if (err)
        return res.status(400).json({
          status: false,
          statusCode: 400,
          message: "An error occured",
          // errors: errors.array(),
        });
      //console.log(err);

      if (docs) {
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
            if (err || docs._id != decoded.userId)
              return res.status(403).json({
                status: false,
                statusCode: 403,
                message: "Invalid token",
              });

            const accessToken = jwt.sign(
              { userId: docs._id, email: decoded.email }, //TODO : Add email also
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1h" }
            );
            delete req.headers["authorization"];
            res.header("Authorization", "Bearer " + accessToken);

            res.status(200).json({
              status: true,
              statusCode: 200,
              message: "Access token generated sucessfully",
              data: { accessToken },
            });
          }
        );
      } else
        res.status(401).json({
          status: false,
          statusCode: 401,
          message: "No match for refresh token found",
        });
    });
  } catch (error) {
    console.log("Error", error);
    internalServerError(res, error);
    // res.json({ ok: false, msg: "Error" });
  }
};
const verifyJWT = (req, res) => {
    console.log(req.users);
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "User is logged in",
    });
  };

module.exports = { handleRefreshToken };
