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
    const photos = req.file.path;

    const cloudinaryResult = await cloudinary.uploader.upload(photos, {
      folder: "image",
    });
    const obj = {
      placeId,
      userId,
      photos: {
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
      },
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
module.exports = {
  addPhoto,
};
