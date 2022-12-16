const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../../controller/usercontroller");
const verifyJWT = require("../../middleware/verifyJWT");
const checkUserLoggedIn = require("../../middleware/checkUserIsLoggedIn");
const feedbackController = require("../../controller/FeedbackCOntroller");
const favoriteController = require("../../controller/FavoriteController");
const upload = require("../../utils/multer");

router.route("/").post(userController.register);
router.route("/login").post(userController.login).delete(userController.logout);
router
  .route("/updateProfilePic")
  .put(upload.single("image"), userController.updateUserProfilePic)
  .get(checkUserLoggedIn, userController.getProfile);

router
  .route("/add-feedback")
  .post(checkUserLoggedIn, feedbackController.addFeedback);
router
  .route("/add-feedback-and-update")
  .post(checkUserLoggedIn, feedbackController.addFeedbackAndUpdateTheSame);
router
  .route("/add-favorite")
  .post(checkUserLoggedIn, favoriteController.addFavorite)
  .get(checkUserLoggedIn, favoriteController.getFavorite);

module.exports = router;

// https://cricket-iota.vercel.app/api/user
