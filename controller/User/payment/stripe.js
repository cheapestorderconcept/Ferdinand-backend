
const stripe = require('stripe')(process.env.STRIPE_KEY);
const { HttpError } = require('../../../middlewares/errors/http-error');
const { httpResponse } = require('../../../middlewares/http/http-response');
const { Shipping } = require('../../../model/User/shipping-address');


const german = process.env.SUPPORTED_LANGUAGE
const initiatePayment = async function initiatePayment(req,res,next){
    try {
        const {total_amount} = req.body;
        const {userId, language} = req.userData;
        const shippingAddress = await Shipping.getAddress(userId);
        if (!total_amount) {
           const e = new HttpError(400, language==german?'Bitte geben Sie den Gesamtbetrag an':'Please provide total_amount');
           return next(e); 
        }
        if (!shippingAddress) {
            const e = new HttpError(400, language==german?'Bitte fügen Sie Ihrem Konto eine Lieferadresse hinzu, um fortzufahren':'Please add a shipping address to your account to continue');
           return next(e);   
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total_amount *100,
            currency: 'usd',
            payment_method_types: ['card'],
          });
          console.log(paymentIntent);
          httpResponse({status_code:201, response_message:language==german?'Zahlungsabsicht erstellt':'Payment intent created', data: {client_secret: paymentIntent.client_secret}, res});
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, language==german?'Wir können die Zahlung derzeit nicht veranlassen':'We are unable to initiate the payment at the moment');
        return next(e);
    }
}

module.exports={
initiatePayment
}



