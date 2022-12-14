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

module.exports ={ addPlace}