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
    //console.log("Userrrr", userId);

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
const getFavorite = async (req, res) => {
  try {
    const { userId } = req.users;
    const { searchParam } = req.query;
    if (searchParam == "" || !searchParam) {
      const user = await User.find({ _id: userId })
        .select("favorite")
        .populate(
          "favorite.placeId",
          "placeName placePic description rating stars address"
        );

      if (user)
        return res.status(200).json({
          status: true,
          statusCode: 200,
          message: "favorite fetched successfully",
          data: user,
        });
      else {
        return res.status(401).json({
          status: false,
          statusCode: 401,
          message: "no favorite found",
        });
      }
    } else {
      console.log("Yooo");
      const user = await User.find({
        _id: userId,
        $or: [
          {
            placeName: { $regex: searchParam, $options: "i" },
          },
          { description: { $regex: searchParam, $options: "i" } },
          {
            address: { $regex: searchParam, $options: "i" },
          },
        ],
      })
        .select("favorite")
        .populate(
          "favorite.placeId",
          "placeName placePic description rating stars address"
        );
      if (user) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "searched favorite fetched",
          data: user,
        });
      } else {
        return res.status(401).json({
          status: false,
          statusCode: 401,
          message: "no match",
        });
      }
    }

    // if (user)
    //   return res.status(200).json({
    //     status: true,
    //     statusCode: 200,
    //     message: "favorite fetched successfully",
    //     data: user,
    //   });
    // res.status(404).json({
    //   status: false,
    //   statusCode: 400,
    //   message: "Couldn't fetch favorite",
    // });

    //.populate("review.userId", "name profilePic");;
  } catch (error) {
    console.log("error from getFavorite", error);
    internalServerError(res, error);
  }
};
module.exports = {
  addFavorite,
  getFavorite,
};
