const express = require("express");
const router = express.Router();
const PlaceController = require("../../controller/place/PlaceController");
const upload = require("../../utils/multer");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .post(verifyJWT, upload.single("image"), PlaceController.addPlace);

module.exports = router;
