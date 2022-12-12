const { internalServerError } = require("../../utils/commonErrors");
const { Place, User } = require("../../models/index");
//const cloudinary = require("../../utils/cloudinaryConfig");
const { default: mongoose } = require("mongoose");

const calculateRating = async (rating, placeId) => {
  const countRatings = await Place.findOneAndUpdate(
    {
      _id: placeId,
    },
    { $inc: { countRating: 1 } }
  );
  console.log("yesssssssssss", countRatings);
  console.log("meddddddd", rating);
  let countRatingg = countRatings.countRating + 1;
  let old_rating = countRatings.rating;
  console.log("Zooooooooo", countRatingg);
  console.log("YOOOO", old_rating);
  let new_rating = (old_rating * (countRatingg - 1) + rating) / countRatingg;
  console.log("uuuuuuuu", new_rating);
  const updatedRating = await Place.findOneAndUpdate(
    {
      placeId,
    },
    { rating: new_rating }
  );

  console.log("hellooooo", countRatings);

  return new_rating;
};

const addRating = async (req, res) => {
  try {
    // countRating++
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId, rating } = req.body;
    const { userId } = req.users;

    if (rating < 0 || rating > 10) {
      return res.json({ message: "Please select rating between 0 to 10" });
    }

    let ratee = calculateRating(rating, placeId);

    const result = await Place.findByIdAndUpdate(
      placeId,
      { ratee },
      { new: true }
    );

    //console.log("##########", result);
    if (result)
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "rating added succesfully",
        data: result,
      });
    else
      res
        .status(400)
        .json({ status: false, statusCode: 400, message: "rating not added" });
  } catch (error) {
    console.log("Error from add rating", error);
    internalServerError(res, error);
  }
};

module.exports = {
  addRating,
};
