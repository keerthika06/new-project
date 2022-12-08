const databaseConnect = () =>{
    const mongoose = require('mongoose')
    const mongoDbURL = "mongodb://127.0.0.1/projectDB";

    mongoose.connect(process.env.DB_URL.tostring())
    .catch((err)=>console.log(err))
} 
module.exports = databaseConnect;
