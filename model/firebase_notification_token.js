const mongoose = require('mongoose');




const firebaseTokenSchema = new mongoose.Schema({
    app_token:  {type:String, required:true},
    userId: {type:mongoose.Types.ObjectId}
});



const firebaseAppToken = mongoose.model("firebase-app-token", firebaseTokenSchema);


module.exports={
    firebaseAppToken
}