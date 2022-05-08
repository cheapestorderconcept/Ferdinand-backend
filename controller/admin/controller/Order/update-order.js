
const { HttpError } = require('../../../../middlewares/errors/http-error');
const { httpResponse } = require('../../../../middlewares/http/http-response');
const { orderModel, orderStatus } = require('../../../../model/order');





const updateClientOrder = async function updateClientOrder(req,res,next) {
    try {
        const {orderId} = req.query;
        if (!orderId) {
            const e = new HttpError(400, "OrderId is missing in your query params");
            return next(e);
        }
        const {order_status, tracking_number, total_price, logistic_name, logistic_website} = req.body;
        const data ={
            order_status,
            tracking_number,
            logistic_name,
            logistic_website,
            total_price
        }
        if (!tracking_number) {
            const e = new HttpError(400, 'Please provide tracking number');
            return next(e);
        }else if(!order_status){
            const e = new HttpError(400, 'Please provide order status');
            return next(e);
        }else if(!logistic_name){
            const e = new HttpError(400, 'Please provide logistic company name number');
            return next(e);
        }
        const acceptedStatus = Object.values(orderStatus);
        if (acceptedStatus.includes(order_status)==false) {
          const e  = new HttpError(400, "The orderstatus supplied in your query is not accepted. Please check doc for accepted status");
          return next(e);
        }
        const updatedOrder  =await  orderModel.updateOrder(orderId, data);
        if (updatedOrder) {
            httpResponse({status_code:200, response_message:'Order has been successfully modified', data:{updatedOrder}, res});
            return;
        }
        const e = new HttpError(500, 'Unable to update this order. Please contact support if persists');
        return next(e);
    } catch (error) {
        joiError(error,next);
    }
}

module.exports={
    updateClientOrder
}