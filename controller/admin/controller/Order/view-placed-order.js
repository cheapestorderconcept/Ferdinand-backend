const { HttpError } = require("../../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../../middlewares/http/http-response");
const { orderModel } = require("../../../../model/order");


const viewClientPlacedOrder = async function viewClientPlacedOrder(params) {
    try {
     const {orderStatus} = req.query;
       const clientPlacedOrder = await orderModel.find({});
         if (clientPlacedOrder.length>0) {
            httpResponse({status_code:200, response_message:'Placed orders', data:{clientPlacedOrder},res});
         }else{
            const e = new HttpError(404, 'You have no order in the selected categories');
            return next(e);  
         }
    } catch (error) {
         console.log(error);
        const e = new HttpError(500, 'A system error has occured. Please contact support if persists');
        return next(e);
    }
}


module.exports={
 viewClientPlacedOrder
}