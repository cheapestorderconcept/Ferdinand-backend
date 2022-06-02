const { HttpError } = require("../../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../../middlewares/http/http-response");
const promoCode = require("../../model/promo_code");


const  german = process.env.SUPPORTED_LANGUAGE;

const generateCode = async function(req,res,next){
    const {language} = req.userData;
    try {
      const {percentage} = req.body;
      if (!percentage) {
         return next(language == german ? new HttpError(400, "Bitte geben Sie den Prozentsatz an, der ausgeschaltet werden soll") : new HttpError(400, "Please supply percenatage to be off")) 
      } 
      const existingCode = await promoCode.find({})
      if (existingCode&&existingCode.length>0) {
          return next(language == german ? new HttpError(400, "Bitte löschen Sie den vorhandenen Code, bevor Sie einen neuen generieren") : new HttpError(400, "Please delete the existing code before generating new one"));
      }
      const code = `Bagofsage${percentage}`
      const newCode = new promoCode({
          code,
          value: percentage
      })
      newCode.save((err)=>{
          if (!err) {
            language == german ? httpResponse({status_code:201, response_message:"Der Promocode kann jetzt verwendet werden",res}) : httpResponse({status_code:201, response_message:"Promocode is now available for use",res});
          }else{
            return next(language == german ? new HttpError(400, "Code kann im Moment nicht generiert werden. Bitte versuche es erneut") : new HttpError(400, "Unable to generate code at the moments. Please try again"))   
          }
      });
    } catch (error) {
      return next(language == german ? new HttpError(500, "Interner Serverfehler. Bitte wenden Sie sich an den Support") : new HttpError(500, "Internal server error. Please contact support"));  
    }
}


const viewPromoCode =  async function(req,res,next){
    const {language} = req.userData;
    try {
        const getCode = await promoCode.find({});
        if (getCode&&getCode.length>0) {
            language == german ?  httpResponse({status_code:200, response_message:`Benutzen ${getCode[0].code} auf der Checkout-Seite, um einen Rabatt auf Ihre Bestellung zu erhalten`, res}) : httpResponse({status_code:200, response_message:`Use ${getCode[0].code} at checkout page to get discount on your order`, res});
        }else{
         return next(language == german ? new HttpError(400, "Store hat derzeit keinen Rabatt auf Produkte. Schauen Sie später noch einmal vorbei") : new HttpError(400, "Store currently has no discount on products. Check back later"));
        }
    } catch (error) {
        return next(language == german ? new HttpError(500, "Internal server error. Please contact support") : new HttpError(500, "Internal server error. Please contact support")); 
    }
}


const expiredCode = async function(req,res,next){
    const {language} = req.userData;
    try {
        const getCode = await promoCode.find({});
        const deleteCode = await promoCode.findOneAndDelete({code: getCode[0].code});
        if (deleteCode) {
         language == german ? httpResponse({status_code:200, response_message:"Sie haben den Rabattcode ungültig gemacht", res}) : httpResponse({status_code:200, response_message:"You have invalidated the discount code", res});  
        }else{
            return next(language == german ? new HttpError(400, "Code kann nicht gelöscht werden. Bitte wenden Sie sich an den Support") : new HttpError(400, "Unable to delete code. Please contact support"));
        }
    } catch (error) {
        return next(language == german ? new HttpError(500, "Interner Serverfehler. Bitte wenden Sie sich an den Support") : new HttpError(500, "Internal server error. Please contact support"));
    }
}

module.exports={
    generateCode,
    viewPromoCode,
    expiredCode
}