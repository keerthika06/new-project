const express = require("express");
const router = express.Router();
const aboutUsController = require("../../controller/admin/aboutUsController");

router
  .route("/")
  .post(aboutUsController.addaboutUs)
  .get(aboutUsController.getaboutUs);
module.exports = router;
