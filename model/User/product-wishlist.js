const mongoose = require('mongoose');




const productWishListSchema =new mongoose.Schema({
    product: {type: {}},
    user: {type: mongoose.Types.ObjectId, ref: 'user'}
},{
    timestamps:true
});





productWishListSchema.statics.addToWishList = async function addToWishList(productDetails) {
    const product  = new productWishListModel(productDetails);
    return product;
}

productWishListSchema.statics.viewWishList = async function viewWishList(userId) {
    const list = await productWishListModel.find({user:userId});
    return list;
}

const productWishListModel = mongoose.model('product-wishlist', productWishListSchema);
module.exports={
 productWishListModel
}