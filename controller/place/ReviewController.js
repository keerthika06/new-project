const { internalServerError } = require("../../utils/commonErrors");
const { Place, User } = require("../../models/index");
const cloudinary = require("../../utils/cloudinaryConfig");
const { default: mongoose } = require("mongoose");

const addReview = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId, reviewText } = req.body;
    const { userId } = req.users;
    const reviewPic = req.file.path;
    const cloudinaryResult = await cloudinary.uploader.upload(reviewPic, {
      folder: "image",
    });
    const obj = {
      //placeId,
      userId,
      reviewPic: {
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
      },
      reviewText,
      date: Date.now(),
    };
    const result = await Place.findByIdAndUpdate(
      { _id: placeId },
      // {_id:userId},
      { $push: { review: obj } },
      { new: true }
    );
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Added review successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error, couldn't add ground", error);
    internalServerError(res, error);
  }
};

const getReview = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId } = req.body;
    const review = await Place.find({ _id: placeId })
      .select("review.reviewText review.date")
      .populate("review.userId", "name profilePic");

    console.log("hiiiiiiiiiiiiii", review);
    if (!review)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "No review are added to this place.",
      });

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Review fetched",
      data: review,
    });
  } catch (error) {
    console.log("Error from get photos", error);
    internalServerError(res, error);
  }
};

const getReviewPhotos = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId } = req.body;
    const reviewPicture = await Place.findOne({ _id: placeId }).select(
      "review.reviewPic"
    );
    console.log("hiiiiiiiiiiiiii", reviewPicture);
    if (!reviewPicture)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "No review photos are added to this place.",
      });

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Review Photos fetched",
      data: reviewPicture,
    });
  } catch (error) {
    console.log("Error from get photos", error);
    internalServerError(res, error);
  }
};
const getParticularReviewPhoto = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId } = req.body;
  } catch (error) {
    console.log("Error from get photos", error);
    internalServerError(res, error);
  }
};

module.exports = {
  addReview,
  getReview,
  getReviewPhotos,
  getParticularReviewPhoto,
};
