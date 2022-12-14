
const mongoose = require('mongoose');
const favoritesProductSchema =new mongoose.Schema({
    product: {type: {}},
    productId: {type:String},
    user: {type: mongoose.Types.ObjectId, ref: 'user'}
}, {
  timestamps:true  
});





favoritesProductSchema.statics.addToFavorites = async function addToFavorites(productDetails) {
    const product  = new favoritesProductModel(productDetails);
    return product;
}

favoritesProductSchema.statics.viewFavorites = async function viewFavorites(userId) {
    const list = await favoritesProductModel.find({user:userId});
    return list;
}

favoritesProductSchema.statics.deleteFavorites = async function deleteFavorites(userId, productId) {
    const list = await favoritesProductModel.findOneAndDelete({user:userId, _id:productId});
    return list;
}
const favoritesProductModel = mongoose.model('favorites-product', favoritesProductSchema);

module.exports={
 favoritesProductModel
}