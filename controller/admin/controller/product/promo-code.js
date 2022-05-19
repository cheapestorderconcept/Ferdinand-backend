const { HttpError } = require("../../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../../middlewares/http/http-response");
const promoCode = require("../../model/promo_code");




const generateCode = async function(req,res,next){
    try {
      const {percentage} = req.body;
      if (!percentage) {
         return next(new HttpError(400, "Please supply percenatage to be off")) 
      } 
      const existingCode = await promoCode.find({})
      if (existingCode&&existingCode.length>0) {
          return next(new HttpError(400, "Please delete the existing code before generating new one"));
      }
      const code = `Bagofsage${percentage}`
      const newCode = new promoCode({
          code,
          value: percentage
      })
      newCode.save((err)=>{
          if (!err) {
              httpResponse({status_code:201, response_message:"Promocode is now available for use",res});
          }else{
            return next(new HttpError(400, "Unable to generate code at the moments. Please try again"))   
          }
      });
    } catch (error) {
      return next(new HttpError(500, "Internal server error. Please contact support"));  
    }
}


const viewPromoCode =  async function(req,res,next){
    try {
        const getCode = await promoCode.find({});
        if (getCode&&getCode.length>0) {
            httpResponse({status_code:200, response_message:`Use ${getCode[0].code} at checkout page to get discount on your order`, res});
        }else{
         return next(new HttpError(400, "Store currently has no discount on products. Check back later"));
        }
    } catch (error) {
        return next(new HttpError(500, "Internal server error. Please contact support")); 
    }
}


const expiredCode = async function(req,res,next){
    try {
        const getCode = await promoCode.find({});
        const deleteCode = await promoCode.findOneAndDelete({code: getCode[0].code});
        if (deleteCode) {
          httpResponse({status_code:200, response_message:"You have invalidated the discount code", res});  
        }else{
            return next(new HttpError(400, "Unable to delete code. Please contact support"));
        }
    } catch (error) {
        return next(new HttpError(500, "Internal server error. Please contact support"));
    }
}

module.exports={
    generateCode,
    viewPromoCode,
    expiredCode
}