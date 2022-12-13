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
    console.log("Userrrr", userId);

    const [ifFavorite] = await User.find({
      "favorite.placeId": placeId,
    });
    //console.log("ZOZOZOOOO", ifFavorite);
    const placedetail = await Place.findOne({ placeId }).select(
      "placeName placePic description rating placeLatLong"
    );

    if (!ifFavorite) {
      //console.log("yooooooo");
      const result = await User.findByIdAndUpdate(
        userId,

        { $push: { favorite: { placeId } } },

        { new: true }
      );
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Added favorite successfully",
        data: result,
      });
    } else {
      const result = await User.findByIdAndUpdate(
        userId,

        { $pull: { favorite: { placeId } } },

        { new: true }
      );
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Removed favorite successfully",
        data: result,
      });
    }
    //console.log("hhhhhhiiiii", ifFavorite);
  } catch (error) {
    console.log("Error, couldn't add favorite", error);
    internalServerError(res, error);
  }
};
module.exports = {
  addFavorite,
};
