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

    const ifFavorite = await User.findOne({
      $and: [{ "favorite.placeId": placeId }, { _id: userId }],
    });

    const placedetail = await Place.findOne({ placeId }).select(
      "placeName placePic description rating placeLatLong"
    );

    if (!ifFavorite) {
      const result = await User.findByIdAndUpdate(
        userId,

        { $push: { favorite: { placeId: placeId } } },

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

        { $pull: { favorite: { placeId: placeId } } },

        { new: true }
      );
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Removed favorite successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log("Error, couldn't add favorite", error);
    internalServerError(res, error);
  }
};
// const getFavorite = async (req, res) => {
//   try {
//     const { userId } = req.users;
//     const { searchParam } = req.query;
//     let x = parseFloat(req.query.latitude);
//     let y = parseFloat(req.query.longitude);

//     if (searchParam == "" || !searchParam) {
//       const user = await User.find({ _id: userId })
//         .select("favorite")
//         .populate(
//           "favorite.placeId",
//           "placeName placePic description overallRating stars address "
//         );

//       // console.log(topPlaces.dist.calculated);

//       if (user)
//         return res.status(200).json({
//           status: true,
//           statusCode: 200,
//           message: "favorite fetched successfully",
//           data: obj,
//         });
//       else {
//         return res.status(401).json({
//           status: false,
//           statusCode: 401,
//           message: "no favorite found",
//         });
//       }
//     } else {
//       const user = await User.findOne({
//         _id: userId,
//       }).select("favorite.placeId");
//       // result of user ------>>>>> favorite: [
//       //   {
//       //     placeId: udupi,
//       //   },
//       //   {
//       //     placeId: manglore,
//       //   },
//       //   {
//       //     placeId: kashmir,
//       //   },
//       // ];
//       const favouritePlaceIdsOfThatUser = user.favorite.map((e) => {
//         return e.placeId;
//       });
//       // result of favoritePlaceOfThatUser---->>>>>[
//       //   udupi,mangalorre,kashmir
//       // ]
//       console.log(favouritePlaceIdsOfThatUser);

//       const favouritePlaces = await Place.find({
//         _id: { $in: favouritePlaceIdsOfThatUser },
//         $or: [
//           {
//             placeName: { $regex: searchParam, $options: "i" },
//           },
//           { description: { $regex: searchParam, $options: "i" } },
//           {
//             address: { $regex: searchParam, $options: "i" },
//           },
//           {
//             category: { $regex: searchParam, $options: "i" },
//           },
//         ],
//       }).select("placeName placePic description rating stars address");

//       if (user) {
//         res.status(200).json({
//           status: true,
//           statusCode: 200,
//           message: "searched favorite fetched",
//           data: favouritePlaces,
//         });
//       } else {
//         return res.status(401).json({
//           status: false,
//           statusCode: 401,
//           message: "no match",
//         });
//       }
//     }

//     // if (user)
//     //   return res.status(200).json({
//     //     status: true,
//     //     statusCode: 200,
//     //     message: "favorite fetched successfully",
//     //     data: user,
//     //   });
//     // res.status(404).json({
//     //   status: false,
//     //   statusCode: 400,
//     //   message: "Couldn't fetch favorite",
//     // });

//     //.populate("review.userId", "name profilePic");;
//   } catch (error) {
//     console.log("error from getFavorite", error);
//     internalServerError(res, error);
//   }
// };

const getFavorite = async (req, res) => {
  try {
    const { userId } = req.users;
    const { searchParam } = req.query;
    let x = parseFloat(req.query.latitude);
    let y = parseFloat(req.query.longitude);

    if (searchParam == "" || !searchParam) {
      const favorites = await User.findOne({ _id: userId }).select("favorite");
      const favouritePlaceIdsOfThatUser = favorites.favorite.map((e) => {
        return e.placeId;
      });

      const filter = await Place.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(y), parseFloat(x)],
            },
            key: "location",
            maxDistance: parseInt(100000) * 1609,
            distanceField: "dist.calculated",
            distanceMultiplier: 1 / 1000,
            spherical: true,
          },
        },
        {
          $match: { _id: { $in: favouritePlaceIdsOfThatUser } },
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
      res.send(filter);
    } else {
      const favorites = await User.findOne({ _id: userId }).select("favorite");

      const favouritePlaceIdsOfThatUser = favorites.favorite.map((e) => {
        return e.placeId;
      });

      const filter = await Place.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(y), parseFloat(x)],
            },
            key: "location",
            maxDistance: parseInt(100000) * 1609,
            distanceField: "dist.calculated",
            distanceMultiplier: 1 / 1000,
            spherical: true,
          },
        },
        {
          // $match: { _id: "favorites.favorite.$.placeId" }

          $match: { _id: { $in: favouritePlaceIdsOfThatUser } },
        },
        {
          $match: {
            $or: [
              {
                placeName: { $regex: searchParam, $options: "i" },
              },
              { description: { $regex: searchParam, $options: "i" } },
              {
                address: { $regex: searchParam, $options: "i" },
              },
              {
                category: { $regex: searchParam, $options: "i" },
              },
            ],
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
      ]);
      res.send(filter);

      // if (user) {
      //   res.status(200).json({
      //     status: true,
      //     statusCode: 200,
      //     message: "searched favorite fetched",
      //     data: favouritePlaces,
      //   });
      // } else {
      //   return res.status(401).json({
      //     status: false,
      //     statusCode: 401,
      //     message: "no match",
      //   });
      // }
    }
  } catch (error) {
    console.log(error);
  }
};

const favoriteFilter = async (req, res) => {
  try {
    latitude = req.body.latitude;
    longitude = req.body.longitude;
    radius = req.body.radius;
    stars = req.body.stars;
    acceptsCreditCard = req.body.acceptsCreditCard;
    delivery = req.body.delivery;
    dogFriendly = req.body.dogFriendly;
    familyFriendly = req.body.familyFriendly;
    inWalkingDistance = req.body.inWalkingDistance;
    outdoorSeating = req.body.outdoorSeating;
    parking = req.body.parking;
    wifi = req.body.wifi;
    sortBy = req.body.sortBy;
    text = req.body.text;
    const { userId } = req.users;

    if (!radius) radius = 2000;
    if (!stars) stars = 4;
    if (sortBy == "distance") sortBy = "distance.calculated";
    else if (sortBy == "popular") sortBy = "viewCount";
    else sortBy = "rating";
    // radius /= 6371;

    const matchlength =
      acceptsCreditCard ||
      delivery ||
      dogFriendly ||
      familyFriendly ||
      inWalkingDistance ||
      outdoorSeating ||
      parking ||
      wifi;

    if (matchlength) {
      match = {
        $and: [
          {
            acceptsCreditCard: acceptsCreditCard,
          },
          {
            delivery: delivery,
          },
          {
            dogFriendly: dogFriendly,
          },
          {
            familyFriendly: familyFriendly,
          },
          {
            inWalkingDistance: inWalkingDistance,
          },
          {
            outdoorSeating: outdoorSeating,
          },
          {
            parking: parking,
          },
          {
            wifi: wifi,
          },
        ],
      };

      match = JSON.parse(JSON.stringify(match));
      // match["$and"] = match["$and"].filter(
      //   (value) => Object.keys(value).length !== 0
      // );
    } else {
      match = {
        $or: [
          {
            acceptsCreditCard: true,
          },
          {
            acceptsCreditCard: false,
          },
        ],
      };
    }
    // let coords = [];
    // coords[0] = longitude;
    // coords[1] = latitude;
    const favorites = await User.findOne({ _id: userId }).select("favorite");
    const favouritePlaceIdsOfThatUser = favorites.favorite.map((e) => {
      return e.placeId;
    });
    // console.log(
    //   "fav",
    //   favorites,
    //   typeof favorites,
    //   "fav",
    //   favorites.favorite,
    //   typeof favorites.favorite
    // );
    const filter = await Place.aggregate([
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
        // $match: { _id: "favorites.favorite.$.placeId" }

        $match: { _id: { $in: favouritePlaceIdsOfThatUser } },
      },
      {
        $match: { $and: [{ stars: { $lte: stars } }] },
      },
      {
        $match: match,
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
    console.log(filter);

    res.send(filter);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addFavorite,
  getFavorite,
  favoriteFilter,
};
