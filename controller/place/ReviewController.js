const { internalServerError } = require("../../utils/commonErrors");
const { Place, User } = require("../../models/index");
const cloudinary = require("../../utils/cloudinaryConfig");
const { default: mongoose } = require("mongoose");

const addReview = async(req,res)=>{
    try{
        if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
        const {placeId,reviewtext,date}=req.body
        const {  userId } = req.users;
        const reviewPic = req.file.path;
        const cloudinaryResult = await cloudinary.uploader.upload(reviewPic, {
            folder: "image",
          });
          const obj = {
            placeId,userId,reviewPic:{
                public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
            },
            reviewtext,
            date
          }
          const result = await Place.findByIdAndUpdate(
            {_id:placeId},
            // {_id:userId},
            {$push : { review : obj}},
            {new : true}

          )
          res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Added ground successfully",
            data: result,
          });
    }
    catch(error) {
        console.log("Error, couldn't add ground", error);
        internalServerError(res, error);
      }
}
module.exports={
    addReview
}