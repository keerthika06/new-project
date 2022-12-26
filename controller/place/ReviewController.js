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

const addReviewByMultipleImages = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { userId } = req.users;
    const { placeId, reviewText } = req.body;
    // console.log("yyyyyyyyyy", req.files);
    const reviewPic = req.files;
    const userfound = await Place.find({
      $and: [{ "review.userId": userId }, { _id: placeId }],
    });

    if (userfound.length == "") {
      const user = await User.findById({ _id: userId });
      let obj;
      const urls = [];
      if (reviewPic) {
        const files = req.files;
        const cloudinaryImageUpload = async (file) => {
          return new Promise((resolve) => {
            cloudinary.uploader.upload(file, (err, res) => {
              if (err) return res.status(500).send("upload image error");
              resolve({
                res: res.secure_url,
              });
            });
          });
        };
        for (const file of files) {
          const { path } = file;
          const newPath = await cloudinaryImageUpload(path, {
            folder: "image",
          });
          urls.push(newPath);
        }
        const user = await User.findById({ _id: userId });
        obj = {
          //placeId,
          userId,
          reviewPic: {
            url: urls.map((url) => url.res),
          },

          reviewText,
          date: Date.now(),
        };
      } else {
        obj = {
          userId,
          reviewText,
          date: Date.now,
        };
      }

      // const t = await obj.save();
      const result = await Place.findByIdAndUpdate(
        { _id: placeId },
        // {_id:userId},
        { $push: { review: obj } },
        { new: true }
      );

      const data = await Place.findByIdAndUpdate(
        { _id: placeId },
        {
          $push: {
            photos: {
              userId: userId,
              picture: {
                url: urls.map((url) => url.res),
              },

              dates: Date.now(),
            },
          },
        },

        { new: true }
      );

      if (data) {
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Review added",
        });
      } else {
        res.status(400).json({
          status: true,
          statusCode: 200,
          message: "Failed to add review",
        });
      }
    } else {
      res.status(400).json({
        status: true,
        statusCode: 200,
        message: "This User has already reviewed this place",
      });
    }
  } catch (error) {
    console.log("Error, couldn't add ground", error);
    internalServerError(res, error);
  }
};

const addReviewOnlyOnce = async (req, res) => {
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
    const userfound = await Place.find({
      $and: [{ "review.userId": userId }, { _id: placeId }],
    });

    if (userfound.length != "") {
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

      const result = await Place.findOneAndUpdate(
        {
          _id: req.body.placeId,
          "review.userId": userId,
        },
        {
          $set: { "review.$.reviewText": req.body.reviewText },
          //$push: { "review.$.reviewPic": { reviewPic } },
        },
        { new: true }
      );

      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "updated review successfully",
        data: result,
      });
    } else {
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
    }
  } catch (error) {
    console.log("Error, couldn't add ground", error);
    internalServerError(res, error);
  }
};

const getReview = async (req, res) => {
  try {
    if (!req.query)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId } = req.query;
    const review = await Place.findOne({ _id: placeId })
      .select("review.reviewText review.reviewPic review.date")
      .populate("review.userId", "name profilePic");

    if (!review)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "No review is added to this place.",
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
    if (!req.query)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    const { placeId } = req.query;
    const reviewPicture = await Place.findOne({ _id: placeId }).select(
      "review.reviewPic"
    );

    // const reviewPicture = await Place.findOne({ _id: placeId }).select(
    //   "review"
    // );
    // if (reviewPicture) {
    //   result = [];
    //   for (i = 0; i < reviewPicture.review.length; i++) {
    //     if (reviewPicture.review[0].reviewPic.url != 0) {
    //       result.push(reviewPicture.review[0].reviewPic.url);
    //     }
    //   }

    //   return res.status(200).json({
    //     status: true,
    //     statusCode: 200,
    //     message: "Photos fetched",
    //     data: result,
    //   });
    // }

    // return res.status(401).json({
    //   status: false,
    //   statusCode: 401,
    //   message: "No photos are added to this place.",
    // });

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
    if (!req.query)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    //const { placeId } = req.body;
    const { photoId } = req.query;
    const place = await Place.findOne(
      { photos: { $elemMatch: { _id: photoId } } },
      { "photos.$": 1 }
    )
      .select("userId date")
      .populate("userId", "name profilePic");
    if (!place)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "No photo is added to this review.",
      });

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Photo details fetched fetched",
      data: place,
    });
  } catch (error) {
    console.log("Error from get photos", error);
    internalServerError(res, error);
  }
};

// const getParticularReviewPhoto = async (req, res) => {
//   try {
//     if (!req.body)
//       return res
//         .status(400)
//         .json({ status: false, statusCode: 400, message: "body is not found" });
//     //const { placeId } = req.body;
//     const { reviewPicId } = req.query;
//     const place = await Place.findOne(
//       { photos: { $elemMatch: { _id: reviewPicId } } },
//       { "photos.$": 1 }
//     )
//       // .select("reviewPic date")
//       .populate("review.userId", "name profilePic");
//     if (!place)
//       return res.status(401).json({
//         status: false,
//         statusCode: 401,
//         message: "No photo is added to this review.",
//       });

//     res.status(200).json({
//       status: true,
//       statusCode: 200,
//       message: "Photo details fetched fetched",
//       data: place,
//     });
//   } catch (error) {
//     console.log("Error from get photos", error);
//     internalServerError(res, error);
//   }
// };
module.exports = {
  addReview,
  addReviewOnlyOnce,
  getReview,
  getReviewPhotos,
  getParticularReviewPhoto,
  addReviewByMultipleImages,
};
