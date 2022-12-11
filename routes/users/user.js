const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../../controller/usercontroller");
const feedbackController = require("../../controller/FeedbackController");
const favoriteController = require("../../controller/FavoriteController")

router.route("/").post(userController.register);
router.route("/login").post(userController.login);

router.route("/add-feedback").post(feedbackController.addFeedback);
router.route("/add-favorite").post(favoriteController.addFavorite)

module.exports = router;

// https://cricket-iota.vercel.app/api/user
