const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { favoritesProductModel } = require("../../../model/favorites-product")
const joi = require('joi');
const joiError = require("../../../middlewares/errors/joi-error");
const { productModel } = require("../../../model/product");

const validation = joi.object({
    product: joi.string().required()
})


const german = process.env.SUPPORTED_LANGUAGE;

const addFavoritesProduct = async function addFavoritesProduct(req,res,next) {
    const {userId, language} = req.userData;
    try {
      
        const val = await validation.validateAsync(req.body);
        const product  = await productModel.getSingleProduct(val.product);
      
        const details = {
            product,
            user: userId
        }
   
        // if (isExists) {
        //     const e = new HttpError(400, "You already add this product to your wishlist");
        //     return next(e);
        // }
        const fav =await  favoritesProductModel.addToFavorites(details);
        fav.save().then((favs)=>{
            httpResponse({status_code:201, response_message:language==german?'Produkt zu Ihrer Favoritenliste hinzugefügt':'Product added to your favorites list', data:{favorites:favs},res});
        }).catch((err)=>{
            console.log(err);
            const e = new HttpError(500, language==german?'Im System ist ein Fehler aufgetreten':'An error occured with the system');
            return next(e)
        })
    } catch (error) {
        joiError(error, next);
    }
}


const favoritesList = async function favoriteList(req,res,next) {
    const {userId, language} = req.userData;
    try {

         const favorites = await favoritesProductModel.viewFavorites(userId);
         if (favorites&&favorites.length>0) {
            httpResponse({status_code: 200, response_message:'Favorites products list', data:{favoriteList:favorites},res});
            return;
         }
         const e = new HttpError(404,language==german?'Sie haben kein Produkt zu Ihren Favoriten hinzugefügt. Jetzt Produkte hinzufügen': 'You have not added any product to your favorites. Add products now');
         return next(e);
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, language==german?'Im System ist ein Fehler aufgetreten': 'An error occured with the system');
        return next(e)
    }
}


const deleteFavoritedProduct = async function deleteFavoritedProduct(req,res,next){
    const {userId, language} = req.userData;
    try {
        const {productId} = req.query;
        const favorites = await favoritesProductModel.deleteFavorites(userId, productId);
        if (favorites) {
            httpResponse({status_code: 200, response_message:language==german?'Produkte von der Wunschliste gelöscht. Lade die Seite neu':'Products deleted from wishlist. Refresh the page', data:{favoriteList:favorites},res});
            return; 
        }else{
            const e = new HttpError(500, language==german?'Im System ist ein Fehler aufgetreten':'An error occured with the system');
            return next(e) 
        }
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, language==german?'Im System ist ein Fehler aufgetreten':'An error occured with the system');
        return next(e)
    }
}

module.exports={favoritesList,addFavoritesProduct, deleteFavoritedProduct}