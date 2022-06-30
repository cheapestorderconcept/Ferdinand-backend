const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { productModel } = require("../../../model/product");

const german = process.env.SUPPORTED_LANGUAGE;

const recommendedProducts = async function recommendedProducts(req,res,next){
    try {
    const  product = await  productModel.getProduct();
    const recommendation  = product.filter(product=>product.views>0);
    if (recommendation&&recommendation.length>0) {
     httpResponse({status_code:200, response_message:'Products recommendation',data:{product:recommendation}, res})
    }else{
      httpResponse({status_code:200, response_message:'Products recommendation',data:{product}, res})
    }
    } catch (error) {
        const e = new HttpError(500, "An internal server error occured. Please contact supports if persists");
        return next(e);
    }
}




module.exports={
    recommendedProducts
}