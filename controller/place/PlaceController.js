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
      category,
      location,
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
      category,
      location,
      //email,

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
        message: "Couldn't create Place",
        data: {},
      });
  } catch (error) {
    console.log("Error from add place", error);
    internalServerError(res, error);
  }
};

const getParticularPlace = async (req, res) => {
  try {
    const { placeId, latitude, longitude } = req.query;
    // const { userId } = req.users;
    //console.log(req.users);
    // if (!mongoose.isValidObjectId(placeId))
    //   return res
    //     .status(400)
    //     .json({ status: false, statusCode: 400, message: "Id not valid" });
    const place = await Place.findOne({ _id: placeId }).select(
      "placeName placePic description photos review overview rating address phone latitude longitude"
    );
    //place.viewCount++;
    await Place.updateOne({ _id: placeId }, { $inc: { viewCount: 1 } }).exec();

    if (!place)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Place does not exist",
      });

    // const filter = await Place.aggregate([
    //   {
    //     $geoNear: {
    //       near: {
    //         type: "Point",
    //         coordinates: [parseFloat(longitude), parseFloat(latitude)],
    //       },
    //       key: "location",
    //       maxDistance: parseInt(100) * 1609,
    //       distanceField: "dist.calculated",
    //       spherical: true,
    //     },
    //   },
    //   { $match: { _id: placeId } },
    //   {
    //     $project: {
    //       _id: 1,
    //       "dist.calculated": 1,
    //       placeName: 1,
    //       placePic: 1,
    //       description: 1,
    //       photos: 1,
    //       review: 1,
    //       overview: 1,
    //       rating: 1,
    //       address: 1,
    //       phone: 1,
    //       latitude: 1,
    //       longitude: 1,
    //       rating: 1,
    //     },
    //   },
    // ]);

    const user = await Place.findOne({ _id: placeId }).select("overallRating ");
    //console.log(userId);

    const data = {
      placeDetails: place,
      //distanceField: filter,
      overallRating: user.overallRating,
    };

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Places fetched",
      data: data,
    });
  } catch (error) {
    console.log("Error from get place", error);
    internalServerError(res, error);
  }
};
const nearMe = async (req, res) => {
  try {
    let x = parseFloat(req.query.latitude);
    let y = parseFloat(req.query.longitude);

    const nearPlaces = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [y, x],
          },
          key: "location",
          maxDistance: parseInt(100) * 1609,
          distanceField: "dist.calculated",
          spherical: true,
        },
      },
      {
        $project: {
          _id: 1,
          "dist.calculated": 1,

          placeName: 1,
          placePic: 1,
          description: 1,
          stars: 1,
          overallRating: 1,
          address: 1,

          //photos: 1,
          //review: 1,
          //overview: 1,
          //rating: 1,
          //phone: 1,
          //latitude: 1,
          //longitude: 1,
          //rating: 1,
        },
      },
    ]);

    console.log(nearPlaces);
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Near you Places fetched",
      data: nearPlaces,
    });
  } catch (error) {
    console.log("Error from near you", error);
    internalServerError(res, error);
  }
};

const searchPlace = async (req, res) => {
  try {
    const result = await Place.find({
      $or: [
        {
          placeName: { $regex: req.body.text, $options: "i" },
        },
        { description: { $regex: req.body.text, $options: "i" } },
        {
          address: { $regex: req.body.text, $options: "i" },
        },
        {
          category: { $regex: req.body.text, $options: "i" },
        },
      ],
    }).select("placeName placePic address rating phone");
    if (result) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Places fetched",
        data: result,
      });
    } else {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "no match",
      });
    }
  } catch (error) {
    console.log("Error from search place", error);
    internalServerError(res, error);
  }
};
const getPopular = async (req, res) => {
  try {
    let x = parseFloat(req.query.latitude);
    let y = parseFloat(req.query.longitude);

    const popularPlaces = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [y, x],
          },
          key: "location",
          maxDistance: parseInt(10000) * 1609,
          distanceField: "dist.calculated",
          spherical: true,
        },
      },
      {
        $project: {
          _id: 0,
          "dist.calculated": 1,
          placeName: 1,
          placePic: 1,
          description: 1,
          stars: 1,
          overallRating: 1,
          address: 1,
        },
      },
    ]).sort("-viewCount");

    // const allPlaces = await Place.find({})
    //   .select(
    //     "placeName placePic description photos review overview rating address phone location"
    //   )

    if (popularPlaces) {
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Places fetched",
        data: popularPlaces,
      });
    } else {
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "No Place is found",
        data: popularPlaces,
      });
    }
  } catch (error) {
    console.log("Error from search place", error);
    internalServerError(res, error);
  }
};

const getTopPicks = async (req, res) => {
  try {
    let x = parseFloat(req.query.latitude);
    let y = parseFloat(req.query.longitude);

    const topPlaces = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [y, x],
          },
          key: "location",
          maxDistance: parseInt(10000) * 1609,
          distanceField: "dist.calculated",
          spherical: true,
        },
      },
      {
        $project: {
          _id: 0,
          "dist.calculated": 1,
          placeName: 1,
          placePic: 1,
          description: 1,
          stars: 1,
          overallRating: 1,
          address: 1,
        },
      },
    ]).sort("-overallRating");

    // const allPlaces = await Place.find({})
    //   .select(
    //     "placeName placePic description photos review overview rating address phone location"
    //   )
    //   .sort([["rating", -1]]);
    if (topPlaces) {
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Places fetched",
        data: topPlaces,
      });
    } else {
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "No Place is found",
        data: topPlaces,
      });
    }
  } catch (error) {
    console.log("Error from search place", error);
    internalServerError(res, error);
  }
};
const getAllPlace = async (req, res) => {
  try {
    const allPlaces = await Place.find({}).select(
      "placeName placePic description photos review overview rating address phone location"
    );
    if (allPlaces) {
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Places fetched",
        data: allPlaces,
      });
    } else {
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "No Place is found",
        data: allPlaces,
      });
    }
  } catch {
    console.log("Error from search place", error);
    internalServerError(res, error);
  }
};

module.exports = {
  addPlace,
  getParticularPlace,
  nearMe,
  searchPlace,
  getPopular,
  getAllPlace,
  getTopPicks,
  // 8fe1a3b448d7df1eeaecbe25d62e0a59826d6bd6
};
