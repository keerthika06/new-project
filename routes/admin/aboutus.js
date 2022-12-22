const express = require("express");
const router = express.Router();
const aboutUsController = require("../../controller/admin/aboutUsController");
const upload = require("../../utils/multer");

const addPlaceController = require("../../controller/admin/adminController");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .post(aboutUsController.addaboutUs)
  .get(aboutUsController.getaboutUs);
router
  .route("/admin/add-place")
  .post(verifyJWT, upload.single("image"), addPlaceController.addPlace);

module.exports = router;
