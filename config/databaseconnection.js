const databaseConnect = () =>{
    const mongoose = require('mongoose')
    const mongoDbURL = "mongodb+srv://keerthika:${process.env.DB_PASSWORD}@cluster0.raqrknr.mongodb.net/test";

    mongoose.connect(process.env.DB_URL.toString())
    .catch((err)=>console.log(err))
} 
module.exports = databaseConnect;
