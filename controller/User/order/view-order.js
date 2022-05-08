const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { orderModel } = require("../../../model/order");





const myOrder = async function myOrder(req,res,next) {
    try {
        const {userId} = req.userData;
        const {orderStatus} = req.query;
        let placedOrder = [];
        if (orderStatus) {
            placedOrder = await orderModel.userGetOrderByStatus(userId, orderStatus);
        }else{
            placedOrder = await orderModel.userGetOrder(userId);
        }
        if (placedOrder&&placedOrder.length>0) {
            httpResponse({status_code:200, response_message:'Order Placed List', data: {placedOrder},res});
            return;
        }
        const e = new HttpError(404, 'You have no  order in this category.');
        return next(e);
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'An error occured with the system. Please contact support if persists');
        return next(e);
    }
}



module.exports={
    myOrder
}