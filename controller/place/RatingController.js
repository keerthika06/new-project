const { internalServerError } = require("../../utils/commonErrors");
const { Place, User } = require("../../models/index");
//const cloudinary = require("../../utils/cloudinaryConfig");
const { default: mongoose } = require("mongoose");

const addRating = async(req,res)=>{
    try{
        if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
        const {placeId,rating}=req.body
        const {userId}= req.users

        console.log("##########",placeId)
        console.log("##########",rating)
        


        const result= await Place.findByIdAndUpdate(
           placeId,
                    { rating},
          {new : true}
        )
        console.log("##########",result)
        if(result)
        res.status(200).json({
            status: true,
        statusCode: 200,
        message: "rating added succesfully",
        data: result,
        })
        else
      res
        .status(400)
        .json({ status: false, statusCode: 400, message: "rating not added" });


    }
    catch(error) {
        console.log("Error from create over", error);
        internalServerError(res, error);
      }
}
module.exports = {
    addRating,
}