

const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
    code: {type:String, required:true},
    value: {type: Number, required:true}
});


const promoCode = mongoose.model("promoCode", promoCodeSchema);

module.exports=promoCode;