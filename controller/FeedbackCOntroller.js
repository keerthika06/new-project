const { User } = require("../models/index");


const { internalServerError } = require("../utils/commonErrors");
const constants = require("../utils/constant");
const { default: mongoose } = require("mongoose");

const addFeedback = async(req,res)=>{
    try{
        if(!req.body)
        return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });

        
        const {  userId } = req.users;
        const {feedbackText} = req.body

        const result= await User.findByIdAndUpdate(
        
                     { feedbackText},
           {new : true}
         )


    }
}