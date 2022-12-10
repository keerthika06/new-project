const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const commonError = require("../utils/commonErrors");
const { validationResult } = require("express-validator");
const constants = require("../utils/constant");
const { internalServerError } = require("../utils/commonErrors");
const jwt = require("jsonwebtoken");
const { mongoose } = require("mongoose");
const { sendEmail } = require("../utils/sendEmail");

const register = async (req, res) => {
  if (!req.body)
    res
      .status(400)
      .json({ status: false, statusCode: 400, message: "body not found" });
  const { email, phone, password } = req.body;

  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty())
    return res.status(403).json({
      status: false,
      statusCode: 403,
      message: "validation Error",
    });

  const userfound = await User.findOne({ email });
  if (userfound)
    return res.status(403).json({
      status: false,
      statusCode: 403,
      message: "User with this email already present",
    });

  bcrypt.hash(password, constant.SALT_ROUNDS, async (err, hash) => {
    if (err)
      return res.status(500).json({
        status: false,
        statusCode: 500,
        message: "could not hash the password",
      });
    hashedPassword = hash;

    try {
      const user = new User({
        email,
        phone,
        password: hashedPassword,
      });
      const result = await user.save();

      if (result) {
        const accessToken = jwt.sign(
          { userId: result._id, email: result.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
          { userId: result._id, email: result.email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        await User.updateOne({ _id: result._id }, { refreshToken });

        res.header("Refresh-Token", refreshToken);
        res.header("AUthorization", "Bearer " + accessToken);
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: " User succesfully registered",
        });
      } else
        res.status(500).json({
          status: false,
          statusCode: 200,
          message: "couldnt register user",
          data: {},
        });
    } catch (error) {
      console.log("error from register", error);
      internalServerError(res, error);
    }
  });
};
const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    User.findOne({ email }, async (err, docs) => {
      if (err)
        return res.status(404).json({
          status: false,
          statusCode: 404,
          message: " User not found",
        });
      if (docs) {
        let dbPassword = docs.password;
        bcrypt.compare(password.toString(), dbPassword, async (err, result) => {
          if (err)
            return res.status(404).json({
              status: false,
              statusCode: 404,
              message: "USer not found",
            });

          if (result == true) {
            const accessToken = jwt.sign(
              { userId: docs, email: docs.email },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1h" }
            );
            const refreshToken = jwt.sign(
              { userId: docs._id, email: docs.email },
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: "1d" }
            );
            await User.updateOne({ _id: docs._id }, { refreshToken });
            res.header("Refreh-Token", refreshToken);
            res.header("Authorization", "Bearer" + accessToken);
            return res.status(200).json({
              status: true,
              statusCode: 200,
              message: "User logged in succssfully",
            });
          } else
            return res.status(401).json({
              status: false,
              statusCode: 401,
              message: "Invalid email or password",
            });
        });
      } else
        return res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Invalid email or password",
        });
    });
  } catch (error) {
    console.log("error from register", error);
    internalServerError(res, error);
  }
};

module.exports = {
  register,
  login,
};
