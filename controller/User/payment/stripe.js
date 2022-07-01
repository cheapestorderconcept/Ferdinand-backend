const stripe = require('stripe')(process.env.STRIPE_KEY);
const { HttpError } = require('../../../middlewares/errors/http-error');
const { httpResponse } = require('../../../middlewares/http/http-response');
const { Shipping } = require('../../../model/User/shipping-address');
const { User } = require('../../../model/User/user');
const promoCode = require('../../admin/model/promo_code');


const german = process.env.SUPPORTED_LANGUAGE
const initiatePayment = async function initiatePayment(req,res,next){
    try {
        const {total_amount,discount_code, user_points} = req.body;
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
        let amountToPay; 
        const userAcct = User.findUserById(userId);
        /***Reward the person that referred with 100 points */
        if (userAcct&&userAcct.referredBy&&userAcct.made_first_purchase==false) {
          User.findOneAndUpdate({referral_id: userAcct.referredBy}, {$inc:{points: 100}});  
          User.updateUserByEmail(userAcct.email,{$inc:{made_first_purchase:true}});
        }
        if (userAcct&&user_points>=100&&!discount_code) {
          //use the points earned on referral to get discounts on the total amount
            if (userAcct>=100&&user_points <200) {
                amountToPay = total_amount * 0.1;
                const data = {
                 $inc: { points: -100 } 
               } 
               User.updateUserByEmail(userAcct.email, data); 
            } else if(userAcct>=200&&user_points <500){
                amountToPay = total_amount * 0.15;
                const data = {
                 $inc: { points: -200 } 
               } 
               User.updateUserByEmail(userAcct.email, data);  
            }else if (user_points>=500) {
                amountToPay = total_amount * 0.2;
                const data = {
                 $inc: { points: -500 } 
               } 
               User.updateUserByEmail(userAcct.email, data); 
            }
        }else{
          if (!discount_code) {
                amountToPay = total_amount;
            }else{
            const code = await promoCode.findOne({code: discount_code});
            if (code) {
                amountToPay = total_amount * code.value;
            }
             else {
                amountToPay = total_amount;
            }
            }
        }
      
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountToPay *100,
            currency: 'chf',
            payment_method_types: ['card'],
          });
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



