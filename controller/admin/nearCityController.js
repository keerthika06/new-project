const { User, Place, NearCity } = require("../../models/index");
const cloudinary = require("../../utils/cloudinaryConfig");
const { internalServerError } = require("../../utils/commonErrors");
const { default: mongoose } = require("mongoose");
const constants = require("../../utils/constant");

const addNearCity = async (req, res) => {
  try {
    let { cityName, location } = req.body;
    const photos = req.file.path;

    const { userId } = req.users;
    const cloudinaryResult = await cloudinary.uploader.upload(
      // profilePic.tempFilePath,
      photos,
      {
        folder: "image",
      }
    );

    const nearCity = new NearCity({
      photos: {
        url: cloudinaryResult.secure_url,
      },
      cityName,
      userId,
      location,
    });
    const result = await nearCity.save();
    if (result)
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "nearCity successfully added",
        data: { result },
      });
    else
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Couldn't create nearCity",
        data: {},
      });
  } catch (error) {
    console.log("Error from add place", error);
    internalServerError(res, error);
  }
};

const getNearCity = async (req, res) => {
  try {
    let x = parseFloat(req.query.latitude);
    let y = parseFloat(req.query.longitude);

    const nearPlaces = await NearCity.aggregate([
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
          cityName: 1,
          photos: 1,
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
module.exports = { getNearCity, addNearCity };
