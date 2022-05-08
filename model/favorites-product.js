
const mongoose = require('mongoose');
const favoritesProductSchema =new mongoose.Schema({
    product: {type: {}},
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
const favoritesProductModel = mongoose.model('favorites-product', favoritesProductSchema);

module.exports={
 favoritesProductModel
}