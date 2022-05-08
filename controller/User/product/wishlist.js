const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { productWishListModel } = require("../../../model/User/product-wishlist");
const joi = require('joi');
const joiError = require("../../../middlewares/errors/joi-error");
const { productModel } = require("../../../model/product");


const validation = joi.object({
    product: joi.string().required()
})

const addProductToWishList = async function addProductToWishList(req,res,next) {
    try {
         const bodyal =await validation.validateAsync(req.body);
         const product  = await productModel.getSingleProduct(bodyal.product);
         const {userId} = req.userData;
         const details ={
             product,
             user: userId
         }
         const newWish = await productWishListModel.addToWishList(details);
          newWish.save().then((wish)=>{
            httpResponse({status_code:201, response_message:'Product added to wish list successfully', data:{wish}, res});
          }).catch((err)=>{
            const e = new HttpError(500, 'A system error has occured. Please contact support if persists');
            return next(e);
          })
    } catch (error) {
        joiError(error, next);
    }
}


const viewWishlist = async function wishList(req,res,next) {   
    try {
        const {userId} = req.userData;
        const wishList = await productWishListModel.viewWishList(userId);
        if (wishList&&wishList.length>0) {
            httpResponse({status_code:200, response_message:'Wish list available', data:{wishList: wishList},res});
            return;
        }
        const e = new HttpError(404, 'You have not added any product to your wish list');
        return next(e);
    } catch (error) {
        const e = new HttpError(500, 'A system error has occured. Please contact support if persists');
        return next(e);
    }
}

module.exports={
    addProductToWishList,
    viewWishlist
}