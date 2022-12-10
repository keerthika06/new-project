const express = require("express");
const router = express.Router();
const otpController = require("../../controller/otpController");

router.route("/").get(otpController.generateOTP).post(otpController.verifyOTP);
router.route("/reset-password").post(otpController.resetPassword);

module.exports = router;
