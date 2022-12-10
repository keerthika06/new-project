const express = require("express");
const router = express.Router();
const PlaceController = require("../../controller/place/PlaceController");
const ReviewController = require("../../controller/place/ReviewController")
const upload = require("../../utils/multer");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .post(verifyJWT, upload.single("image"), PlaceController.addPlace);
router.route("/review")
.post(verifyJWT, upload.single("image"), ReviewController.addReview)
module.exports = router;
