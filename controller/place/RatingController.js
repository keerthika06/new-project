// const { internalServerError } = require("../../utils/commonErrors");
// const { Place, User } = require("../../models/index");
// //const cloudinary = require("../../utils/cloudinaryConfig");
// const { default: mongoose } = require("mongoose");

// const calculateRating = async (rating, placeId) => {
//   const countRatings = await Place.findOneAndUpdate(
//     {
//       _id: placeId,
//     },
//     { $inc: { countRating: 1 } },
//     { new: true }
//     // { returnDocument: "after" }
//   );
//   console.log("yesssssssssss", countRatings);
//   console.log("meddddddd", rating);
//   let countRatingg = countRatings.countRating;
//   let old_rating = countRatings.rating;
//   console.log("Zooooooooo", countRatingg);
//   console.log("YOOOO", old_rating);
//   let new_rating = (old_rating * (countRatingg - 1) + rating) / countRatingg;
//   console.log("uuuuuuuu", new_rating);
//   const updatedRating = await Place.findOneAndUpdate(
//     {
//       placeId,
//     },
//     { rating: new_rating },
//     { new: true }
//   );

//   console.log("hellooooo", countRatings);

//   return new_rating;
// };

// const addRating = async (req, res) => {
//   try {
//     // countRating++
//     if (!req.body)
//       return res
//         .status(400)
//         .json({ status: false, statusCode: 400, message: "body is not found" });
//     const { placeId, rating } = req.body;
//     const { userId } = req.users;

//     if (rating < 0 || rating > 5) {
//       return res.json({ message: "Please select rating between 0 to 5" });
//     }

//     let ratee = await calculateRating(rating, placeId);

//     const result = await Place.findByIdAndUpdate(
//       placeId,
//       { rating: ratee },
//       { new: true }
//     );

//     //console.log("##########", result);
//     if (result)
//       res.status(200).json({
//         status: true,
//         statusCode: 200,
//         message: "rating added succesfully",
//         data: result,
//       });
//     else
//       res
//         .status(400)
//         .json({ status: false, statusCode: 400, message: "rating not added" });
//   } catch (error) {
//     console.log("Error from add rating", error);
//     internalServerError(res, error);
//   }
// };

// module.exports = {
//   addRating,
// };

const { internalServerError } = require("../../utils/commonErrors");
const { Place, User } = require("../../models/index");
//const cloudinary = require("../../utils/cloudinaryConfig");
const { default: mongoose } = require("mongoose");

const addRating = async (req, res) => {
  try {
    
    // countRating++
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId, overallRating } = req.body;
    const { userId } = req.users;

    if (overallRating < 0 || overallRating > 5) {
      return res.json({ message: "Please select rating between 0 to 5" });
    }
    
    const userfound = await Place.findOne({
      $and: [
        {
          "rating.userId": userId,
        },
        {
          _id: placeId,
        },
      ],
    });
    
    if (userfound == null || userfound.length < 1) {
      
      await Place.findByIdAndUpdate(
        placeId,

        {
          $push: {
            rating: {
              userId: userId,
            },
          },
        },

        { new: true }
      );
      const countRatings = await Place.findOneAndUpdate(
        {
          _id: placeId,
        },
        { $inc: { countRating: 1 } },
        { new: true }
      );
     
      let countRatingg = countRatings.countRating;
     
      let old_rating = countRatings.overallRating;
     
      let sub = countRatingg - 1;
     
      let mul = old_rating * sub;
    
      let add = mul + overallRating;
      
      let new_rating = add / countRatingg;
     
      const updatedRating = await Place.findOneAndUpdate(
        {
          _id: placeId,
        },
        { overallRating: new_rating },

        { new: true }
      );
      const result = await Place.findByIdAndUpdate(
        placeId,
        { overallRating: new_rating },
        { new: true }
      ).select("overallRating");

      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "added rating successfully",
        data: result,
      });
    } else {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "This user has already given rating",
      });
    }
  } catch (error) {
    console.log("Error from add rating", error);
    internalServerError(res, error);
  }
};

module.exports = {
  addRating,
};
