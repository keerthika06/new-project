const { User, Place } = require("../../models/index");
const cloudinary = require("../../utils/cloudinaryConfig");
const { internalServerError } = require("../../utils/commonErrors");
const { default: mongoose } = require("mongoose");
const constants = require("../../utils/constant");

const addPlace = async (req, res) => {
  try {
    let {
      placeName,
      description,
      overview,
      address,
      phone,
      latitude,
      longitude,
      acceptsCreditCard,
      delivery,
      dogFriendly,
      familyFriendly,
      inWalkingDistance,
      outdoorSeating,
      parking,
      wifi,
    } = req.body;
    const { email, userId } = req.users;
    const placePic = req.file.path;

    const cloudinaryResult = await cloudinary.uploader.upload(
      // profilePic.tempFilePath,
      placePic,
      {
        folder: "image",
      }
    );
    //const picture = cloudinaryResult.url;
    // console.log(picture);
    const place = new Place({
      placePic: {
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
      },
      placeName,
      userId,
      description,
      overview,
      address,
      phone,
      latitude,
      longitude,
      email,
      acceptsCreditCard,
      delivery,
      dogFriendly,
      familyFriendly,
      inWalkingDistance,
      outdoorSeating,
      parking,
      wifi,
    });
    const result = await place.save();
    if (result)
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Place successfully added",
        data: { result },
      });
    else
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Couldn't create tournament",
        data: {},
      });
  } catch (error) {
    console.log("Error from add place", error);
    internalServerError(res, error);
  }
};

const getParticularPlace = async (req, res) => {
  try {
    const { placeId } = req.body;
    // if (!mongoose.isValidObjectId(placeId))
    //   return res
    //     .status(400)
    //     .json({ status: false, statusCode: 400, message: "Id not valid" });
    const place = await Place.findOne({ _id: placeId }).select(
      "placeName placePic description overview address phone latitude longitude"
    );

    if (!place) 
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Place does not exist",
      });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Places fetched",
      data: place,
    });
  } catch (error) {
    console.log("Error from get place", error);
    internalServerError(res, error);
  }
};

module.exports = {
  addPlace,
  getParticularPlace,
};
