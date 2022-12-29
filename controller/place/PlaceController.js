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
      "placeName placePic description photos review overview rating address phone location"
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
    // let page = req.query.page >= 1 ? req.query.page : 1; // for pagination
    // let queryToBeExecuted = "";
    // page = page - 1;

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
          maxDistance: parseInt(10000) * 1609,
          distanceField: "dist.calculated",
          distanceMultiplier: 1 / 1000,
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
      // { $skip: constants.RESULTS_PER_PAGE * page },

      // { $limit: constants.RESULTS_PER_PAGE },
    ]);
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

// const searchPlace = async (req, res) => {
//   try {

//     const result = await Place.find({
//       $or: [
//         {
//           placeName: { $regex: req.query.text, $options: "i" },
//         },
//         { description: { $regex: req.query.text, $options: "i" } },
//         {
//           address: { $regex: req.query.text, $options: "i" },
//         },
//         {
//           category: { $regex: req.query.text, $options: "i" },
//         },
//       ],
//     });
//     //.select("placeName placePic address rating phone");
//     if (result) {
//       res.status(200).json({
//         status: true,
//         statusCode: 200,
//         message: "Places fetched",
//         data: result,
//       });
//     } else {
//       return res.status(401).json({
//         status: false,
//         statusCode: 401,
//         message: "no match",
//       });
//     }
//   } catch (error) {
//     console.log("Error from search place", error);
//     internalServerError(res, error);
//   }
// };

const searchPlace = async (req, res) => {
  try {
    latitude = req.body.latitude;
    longitude = req.body.longitude;
    text = req.body.text;

    const result = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          key: "location",
          maxDistance: parseInt(100000) * 1609,
          distanceField: "dist.calculated",
          distanceMultiplier: 1 / 1000,
          spherical: true,
        },
      },
      {
        $match: {
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
        },
      },
    ]);

    //.select("placeName placePic address rating phone");
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
          distanceMultiplier: 1 / 1000,
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
          distanceMultiplier: 1 / 1000,
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
const updatePlace = async (req, res) => {
  try {
    let {
      placeId,
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
    // location.coordinates = location.coordinates
    if (location) location.type = "Point";

    let placePic = {};
    cloudinaryResult = {};

    if (req.file) {
      placePic = req.file.path;
      cloudinaryResult = await cloudinary.uploader.upload(placePic, {
        folder: "image",
      });

      placePic = {
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
      };
    } else {
      let usersProfilePic = await Place.findOne({
        _id: placeId,
      }).select("placePic");
      placePic = {
        public_id: usersProfilePic.placePic.public_id,
        url: usersProfilePic.placePic.url,
      };
    }
    console.log("aaa");

    updatedData = {
      placeName: placeName,
      description: description,
      overview: overview,
      address: address,
      phone: phone,
      category: category,
      location: location,
      acceptsCreditCard: acceptsCreditCard,
      delivery: delivery,
      dogFriendly: dogFriendly,
      familyFriendly: familyFriendly,
      inWalkingDistance: inWalkingDistance,
      outdoorSeating: outdoorSeating,
      parking: parking,
      wifi: wifi,
      placePic: placePic,
    };
    // console.log("updatedData", updatedData);
    updatedData = JSON.parse(JSON.stringify(updatedData));
    // console.log("updatedData2", updatedData);

    const place = await Place.findOneAndUpdate(
      {
        _id: placeId,
      },
      updatedData,
      { new: true }
    ); //.select("placeName description overview address phone category location acceptsCreditCard delivery dogFriendly familyFriendly inWalkingDistance outdoorSeating parking wifi");
    // console.log("place", place);
    if (place)
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Place updated successfully",
        data: place,
      });
    res.status(404).json({
      status: false,
      statusCode: 400,
      message: "Error occured",
    });
  } catch (error) {
    console.log("Error from search place", error);
    internalServerError(res, error);
  }
};
const getResturants = async (req, res) => {
  try {
    if (!req.query)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });

    let x = parseFloat(req.query.latitude);
    let y = parseFloat(req.query.longitude);

    const resturant = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [y, x],
          },
          key: "location",
          maxDistance: parseInt(10000) * 1609,
          distanceField: "dist.calculated",
          distanceMultiplier: 1 / 1000,
          spherical: true,
        },
      },
      {
        $match: { category: "Resturant" },
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
        },
      },
    ]);

    // const resturant = await Place.find({ category: "Resturant" }).select(
    //   "placeName placePic description photos review overview rating address phone latitude longitude"
    // );
    if (!resturant)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "No lunch is added.",
      });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Lunch fetched",
      data: resturant,
    });
  } catch (error) {
    console.log("Error from get lunch", error);
    internalServerError(res, error);
  }
};

const getShopping = async (req, res) => {
  try {
    if (!req.query)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });

    let x = parseFloat(req.query.latitude);
    let y = parseFloat(req.query.longitude);

    const resturant = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [y, x],
          },
          key: "location",
          maxDistance: parseInt(10000) * 1609,
          distanceField: "dist.calculated",
          distanceMultiplier: 1 / 1000,
          spherical: true,
        },
      },
      {
        $match: { category: "Shopping" },
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
        },
      },
    ]);

    // const resturant = await Place.find({ category: "Resturant" }).select(
    //   "placeName placePic description photos review overview rating address phone latitude longitude"
    // );
    if (!resturant)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "No Shopping is added.",
      });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Shopping fetched",
      data: resturant,
    });
  } catch (error) {
    console.log("Error from get Shopping", error);
    internalServerError(res, error);
  }
};

const getAttraction = async (req, res) => {
  try {
    if (!req.query)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });

    let x = parseFloat(req.query.latitude);
    let y = parseFloat(req.query.longitude);

    const resturant = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [y, x],
          },
          key: "location",
          maxDistance: parseInt(10000) * 1609,
          distanceField: "dist.calculated",
          distanceMultiplier: 1 / 1000,
          spherical: true,
        },
      },
      {
        $match: { category: "Attraction" },
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
        },
      },
    ]);

    // const resturant = await Place.find({ category: "Resturant" }).select(
    //   "placeName placePic description photos review overview rating address phone latitude longitude"
    // );
    if (!resturant)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "No Attraction is added.",
      });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Attraction fetched",
      data: resturant,
    });
  } catch (error) {
    console.log("Error from get Attraction", error);
    internalServerError(res, error);
  }
};

const getServices = async (req, res) => {
  try {
    if (!req.query)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });

    let x = parseFloat(req.query.latitude);
    let y = parseFloat(req.query.longitude);

    const resturant = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [y, x],
          },
          key: "location",
          maxDistance: parseInt(10000) * 1609,
          distanceField: "dist.calculated",
          distanceMultiplier: 1 / 1000,
          spherical: true,
        },
      },
      {
        $match: { category: "Services" },
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
        },
      },
    ]);

    // const resturant = await Place.find({ category: "Resturant" }).select(
    //   "placeName placePic description photos review overview rating address phone latitude longitude"
    // );
    if (!resturant)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "No service is added.",
      });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Services fetched",
      data: resturant,
    });
  } catch (error) {
    console.log("Error from get service", error);
    internalServerError(res, error);
  }
};
const getCoffee = async (req, res) => {
  try {
    if (!req.query)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });

    let x = parseFloat(req.query.latitude);
    let y = parseFloat(req.query.longitude);

    const coffee = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [y, x],
          },
          key: "location",
          maxDistance: parseInt(10000) * 1609,
          distanceField: "dist.calculated",
          distanceMultiplier: 1 / 1000,
          spherical: true,
        },
      },
      {
        $match: { category: "Coffee" },
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
        },
      },
    ]);

    // const resturant = await Place.find({ category: "Resturant" }).select(
    //   "placeName placePic description photos review overview rating address phone latitude longitude"
    // );
    if (!coffee)
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "No coffee is added.",
      });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Coffee's details fetched",
      data: coffee,
    });
  } catch (error) {
    console.log("Error from get coffee", error);
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
  updatePlace,
  getResturants,
  getCoffee,
  getShopping,
  getAttraction,
  getServices,

  // 8fe1a3b448d7df1eeaecbe25d62e0a59826d6bd6
};
