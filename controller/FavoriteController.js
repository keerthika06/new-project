const { User } = require("../models/index");
const { Place } = require("../models/index");
const { internalServerError } = require("../utils/commonErrors");
const constants = require("../utils/constant");
const { default: mongoose } = require("mongoose");

const addFavorite = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId } = req.body;

    const { userId } = req.users;

    const result = await User.findByIdAndUpdate(
      userId,

      { $push: { favorite: placeId } },
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
  addFavorite,
};
