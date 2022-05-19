const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { favoritesProductModel } = require("../../../model/favorites-product")
const joi = require('joi');
const joiError = require("../../../middlewares/errors/joi-error");
const { productModel } = require("../../../model/product");

const validation = joi.object({
    product: joi.string().required()
})




const addFavoritesProduct = async function addFavoritesProduct(req,res,next) {
    try {
        const val = await validation.validateAsync(req.body);
        const product  = await productModel.getSingleProduct(val.product);
        const {userId} = req.userData;
        const details = {
            product,
            user: userId
        }
        // console.log(details);
        const isExists = await favoritesProductModel.find({});
        console.log(isExists);
        return;
        if (isExists) {
            const e = new HttpError(400, "You already add this product to your wishlist");
            return next(e);
        }
        const fav =await  favoritesProductModel.addToFavorites(details);
        fav.save().then((favs)=>{
            httpResponse({status_code:201, response_message:'Product added to your favorites list', data:{favorites:favs},res});
        }).catch((err)=>{
            console.log(err);
            const e = new HttpError(500, 'An error occured with the system');
            return next(e)
        })
    } catch (error) {
        joiError(error, next);
    }
}


const favoritesList = async function favoriteList(req,res,next) {
    try {
        const {userId} = req.userData;
         const favorites = await favoritesProductModel.viewFavorites(userId);
         if (favorites&&favorites.length>0) {
            httpResponse({status_code: 200, response_message:'Favorites products list', data:{favoriteList:favorites},res});
            return;
         }
         const e = new HttpError(404, 'You have not added any product to your favorites. Add products now');
         return next(e);
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'An error occured with the system');
        return next(e)
    }
}

module.exports={favoritesList,addFavoritesProduct}