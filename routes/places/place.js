const express = require("express");
const router = express.Router();
const PlaceController = require("../../controller/place/PlaceController");
const ReviewController = require("../../controller/place/ReviewController")
const RatingController = require("../../controller/place/RatingController")
const upload = require("../../utils/multer");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .post(verifyJWT, upload.single("image"), PlaceController.addPlace);
router.route("/review")
.post(verifyJWT, upload.single("image"), ReviewController.addReview)
router.route("/rating")
.post(verifyJWT,RatingController.addRating)
module.exports = router;
