const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { orderModel } = require("../../../model/order");



const german = process.env.SUPPORTED_LANGUAGE

const myOrder = async function myOrder(req,res,next) {
    const {userId,role, language} = req.userData;
    try {
        
        const {orderStatus} = req.query;
        let placedOrder = [];
       
        if (role!="admin") {
            placedOrder = await orderModel.userGetOrder(userId);
        }else{
            placedOrder = await orderModel.find({}); 
        }
        if (placedOrder&&placedOrder.length>0) {
            httpResponse({status_code:200, response_message:'Order Placed List', data: {placedOrder},res});
            return;
        }
        const e = new HttpError(404,language==german?'Sie haben keine Bestellung in dieser Kategorie.': 'You have no  order in this category.');
        return next(e);
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, language==german?'Im System ist ein Fehler aufgetreten. Bitte wenden Sie sich an den Support, wenn das Problem weiterhin besteht':'An error occured with the system. Please contact support if persists');
        return next(e);
    }
}



module.exports={
    myOrder
}