const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../../controller/usercontroller");

router.route("/").post(userController.register);

module.exports = router;

// https://cricket-iota.vercel.app/api/user
