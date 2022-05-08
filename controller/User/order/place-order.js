
const joi = require('joi');
const { HttpError } = require('../../../middlewares/errors/http-error');
const joiError = require('../../../middlewares/errors/joi-error');
const { httpResponse } = require('../../../middlewares/http/http-response');
const { orderModel } = require('../../../model/order');
const { Shipping } = require('../../../model/User/shipping-address');
const validation = joi.object({
     items: joi.array().min(1),

});

const placeOrder = async function placeOrder(req,res,next) {    
    try {  
        const {userId} = req.userData;
        const shippingAddress = await Shipping.getAddress(userId);
        const bodyValidation = await validation.validateAsync(req.body);
        const {items} = bodyValidation;
        let returnArray = [];
        if (shippingAddress) {
            for (let index = 0; index < items.length; index++) {
                const order = items[index]
                const orderDetails ={
                    product_name: order.product_name,
                    total_price: order.product_price,
                    user: userId,
                    product_color:order.product_color,
                    product_size: order.product_size,
                    quantity: order.qty,
                    product_image: order.image,
                    shipping_address:shippingAddress
                }
                const addOrders = await orderModel.addOrder(orderDetails);
            if (addOrders) {
                returnArray[index] = {product_name: '', product_price: 0}
                if (Object.keys(returnArray).length==items.length) {
                  httpResponse({status_code:200, response_message:'Your order has been successfully placed',data:{},res});
                }
            }
            }
        }else{
            const e = new HttpError(400, 'Please add your shipping address, before placing order');
            return next(e);
        }
    } catch (error) {
        joiError(error, next);
    }
}


module.exports={
    placeOrder
}