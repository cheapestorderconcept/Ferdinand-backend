
const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
    phone_number : {type:String, required:true},
    first_name: {type:String, required:true},
    last_name: {type:String, required:true},
    address: {type:String, required:true},
    land_region: {type:String},
    zip_code: {type:String},
    user: {type:mongoose.Types.ObjectId, ref:'user'},
 
},{
    timestamps:true
})


shippingAddressSchema.statics.addShippingAddress = async function addingShippingAddress(shippingDetails) {
    const newAddress = new Shipping(
        shippingDetails);
    const address = await newAddress.save();
    return address;
}

shippingAddressSchema.statics.updateAddress = async function updateAddress(addressId, data) {
    const updatedAddress = await Shipping.findOneAndUpdate({_id:addressId},data,{upsert:true, new:true});
    return updatedAddress;
}

shippingAddressSchema.statics.getAddress = async function getAddress(userId) {
    const userAddress = await Shipping.findOne({user:userId});
    return userAddress;
}

shippingAddressSchema.statics.deleteAddress = async function deleteAddress(addressId) {
    const userAddress = await Shipping.findOneAndDelete({_id:addressId});
    return userAddress;
}


const Shipping = mongoose.model('shipping-address', shippingAddressSchema);


module.exports={
    Shipping
}