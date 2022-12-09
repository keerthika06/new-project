const databaseConnect = () =>{
    const mongoose = require('mongoose')
    mongoose.set('strictQuery', true);
    const mongoDbURL = process.env.DB_URL.toString()
    //"mongodb+srv://keerthika:${process.env.DB_PASSWORD}@cluster0.raqrknr.mongodb.net/test";

    mongoose.connect(mongoDbURL).then(console.log("connected"))
    .catch((err)=>console.log(err))
} 
module.exports = databaseConnect;
