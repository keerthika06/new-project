const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../../controller/usercontroller");
const verifyJWT = require("../../middleware/verifyJWT");
const checkUserLoggedIn = require("../../middleware/checkUserIsLoggedIn");
const feedbackController = require("../../controller/FeedbackCOntroller");
const favoriteController = require("../../controller/FavoriteController");

router.route("/").post(userController.register);
router.route("/login").post(userController.login);
router.route("/updateProfilePic").put(userController.updateUserProfilePic);

router
  .route("/add-feedback")
  .post(checkUserLoggedIn, feedbackController.addFeedback);
router
  .route("/add-favorite")
  .post(checkUserLoggedIn, favoriteController.addFavorite);

module.exports = router;

// https://cricket-iota.vercel.app/api/user
