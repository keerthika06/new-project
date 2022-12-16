const { User } = require("../models/index");

const { internalServerError } = require("../utils/commonErrors");
const constants = require("../utils/constant");
const { default: mongoose } = require("mongoose");

const addFeedbackAndUpdateTheSame = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });

    const { userId } = req.users;
    console.log(userId);

    const feedbackText = req.body;

    const user = await User.findByIdAndUpdate(userId, feedbackText);
    const result = await user.save();

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Added feedback successfully",
      //data: result,
    });
  } catch (error) {
    console.log("Error, couldn't add feedback", error);
    internalServerError(res, error);
  }
};
const addFeedback = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { userId } = req.users;
    const { feedbackText } = req.body;
    console.log("hhhi", feedbackText);

    const result = await User.findByIdAndUpdate(
      { _id: userId },

      { $push: { feedbackText } },

      { new: true }
    );
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Added favorite successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error, couldn't add favorite", error);
    internalServerError(res, error);
  }
};

module.exports = {
  addFeedback,
  addFeedbackAndUpdateTheSame,
};
