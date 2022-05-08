
const mongoose = require("mongoose");




const databaseAuthentication =async()=>{
    try {
        mongoose.connect(process.env.DATABASE_URL).then(()=>{
            console.log("Database connected");
        }).catch((err)=>{
            console.log(err);
        })
    } catch (error) {
        
    }
}


module.exports={
    databaseAuthentication,
}