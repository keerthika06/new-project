const express = require("express");
const router = express.Router();
const PlaceController = require("../../controller/place/PlaceController");
const ReviewController = require("../../controller/place/ReviewController");
const RatingController = require("../../controller/place/RatingController");
const PhotoController = require("../../controller/place/PhotoController");
const upload = require("../../utils/multer");
const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .post(verifyJWT, upload.single("image"), PlaceController.addPlace)
  .get(verifyJWT, PlaceController.getParticularPlace);
router.route("/near-me").get(PlaceController.nearMe);
router.route("/search-place").get(PlaceController.searchPlace);
router.route("/get-all-places").get(PlaceController.getAllPlace);
router
  .route("/review")
  .post(verifyJWT, upload.single("image"), ReviewController.addReview)
  .get(ReviewController.getReview);
router.route("/get-review-photos").get(ReviewController.getReviewPhotos);
router
  .route("/get-Particular-Review-Photo")
  .get(ReviewController.getParticularReviewPhoto);
router.route("/rating").post(verifyJWT, RatingController.addRating);

router
  .route("/photo")
  .post(verifyJWT, upload.single("image"), PhotoController.addPhoto)
  .get(PhotoController.getPhoto);

module.exports = router;
