const {internalServerError} = require("../../utils/commonErrors")
const { Place, User } = require("../../models/index");
const cloudinary = require("../../utils/cloudinaryConfig");
const { default: mongoose } = require("mongoose");


const addPhoto = async(req,res) =>{
    try {
        if(!req.body)
        return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
        const { tournamentId} =req.body;
        const photos = req.file.path

        const cloudinaryResult = await cloudinary.uploader.upload(photos, {
            folder: "pictures",
          });
          

    }
    catch{

    }
}