const express = require("express");
const router = express.Router();
const refreshTokenController = require("../../controller/refreshTokenController");

router.route("/").get(refreshTokenController.handleRefreshToken);

module.exports = router;
