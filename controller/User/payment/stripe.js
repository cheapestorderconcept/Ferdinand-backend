
const stripe = require('stripe')(process.env.STRIPE_KEY);
const { HttpError } = require('../../../middlewares/errors/http-error');
const { httpResponse } = require('../../../middlewares/http/http-response');
const { Shipping } = require('../../../model/User/shipping-address');



const initiatePayment = async function initiatePayment(req,res,next){
    try {
        const {total_amount} = req.body;
        const {userId} = req.userData;
        const shippingAddress = await Shipping.getAddress(userId);
        if (!total_amount) {
           const e = new HttpError(400, 'Please provide total_amount');
           return next(e); 
        }
        if (!shippingAddress) {
            const e = new HttpError(400, 'Please add a shipping address to your account to continue');
           return next(e);   
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total_amount *100,
            currency: 'usd',
            payment_method_types: ['card'],
          });
          httpResponse({status_code:201, response_message:'Payment intent created', data: {client_secret: paymentIntent.client_secret}, res});
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'We are unable to initiate the payment');
        return next(e);
    }
}

module.exports={
initiatePayment
}



