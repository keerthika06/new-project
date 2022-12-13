const { internalServerError } = require("../../utils/commonErrors");
const { Place, User } = require("../../models/index");
const cloudinary = require("../../utils/cloudinaryConfig");
const { default: mongoose } = require("mongoose");

const addPhoto = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId } = req.body;
    const { userId } = req.users;
    const picture = req.file.path;

    const cloudinaryResult = await cloudinary.uploader.upload(picture, {
      folder: "image",
    });
    const obj = {
      placeId,
      userId,
      picture: {
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
      },
      dates: Date.now(),
    };

    const result = await Place.findByIdAndUpdate(
      { _id: placeId },
      // {_id:userId},
      { $push: { photos: obj } },
      { new: true }
    );
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Added photo successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error, couldn't add photo", error);
    internalServerError(res, error);
  }
};

const getPhoto = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId } = req.body;
    const photos = await Place.findOne({ _id: placeId }).select("photos");
    console.log(photos);
    if (!photos)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "No photos are added to this place.",
      });

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Photos fetched",
      data: photos.photos,
    });
  } catch (error) {
    console.log("Error from get photos", error);
    internalServerError(res, error);
  }
};
const getParticularPhoto = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId } = req.body;
    const { photoId } = req.body;
    const { userId } = req.users;
    const photos = await Place.findOne({ _id: placeId }).select("photos");
    const user = await User.findOne({ _id: userId });
    if (!photos) {
    }
  } catch (error) {
    console.log("Error from get particular photos", error);
    internalServerError(res, error);
  }
};
module.exports = {
  addPhoto,
  getPhoto,
  getParticularPhoto,
};
