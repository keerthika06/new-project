const express = require("express");
const router = express.Router();
const PlaceController = require("../../controller/place/PlaceController");
const ReviewController = require("../../controller/place/ReviewController");
const RatingController = require("../../controller/place/RatingController");
const PhotoController = require("../../controller/place/PhotoController");
const FilterController = require("../../controller/place/FilterController");
const upload = require("../../utils/multer");

const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  .post(verifyJWT, upload.single("image"), PlaceController.addPlace)
  .get(PlaceController.getParticularPlace)
  .put(verifyJWT, upload.single("image"), PlaceController.updatePlace);
router.route("/near-me").get(PlaceController.nearMe);
router.route("/search-place").get(PlaceController.searchPlace);
router.route("/get-all-places").get(PlaceController.getAllPlace);
router.route("/get-popular").get(PlaceController.getPopular);
router.route("/get-top-picks").get(PlaceController.getTopPicks);
router
  .route("/review")
  .post(verifyJWT, upload.single("image"), ReviewController.addReview)
  .get(ReviewController.getReview);
router
  .route("/add-review-only-once")
  .post(verifyJWT, upload.single("image"), ReviewController.addReviewOnlyOnce);
router.route("/get-review-photos").get(ReviewController.getReviewPhotos);
router
  .route("/addReviewByMultipleImages")
  .post(
    verifyJWT,
    upload.array("image"),
    ReviewController.addReviewByMultipleImages
  );

router.route("/find-filter").post(FilterController.findFilter);

router
  .route("/get-Particular-Review-Photo")
  .get(ReviewController.getParticularReviewPhoto);
router.route("/rating").post(verifyJWT, RatingController.addRating);

router
  .route("/photo")
  .post(verifyJWT, upload.single("image"), PhotoController.addPhoto)
  .get(PhotoController.getPhoto);

router
  .route("/upload-Multiple-Photos")
  .post(verifyJWT, upload.array("image"), PhotoController.uploadMultiplePhotos);

router.route("/get-resturant").get(PlaceController.getResturants);
router.route("/get-shopping").get(PlaceController.getShopping);
router.route("/get-attraction").get(PlaceController.getAttraction);
router.route("/get-services").get(PlaceController.getServices);
module.exports = router;
