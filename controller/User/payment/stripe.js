const stripe = require('stripe')(process.env.STRIPE_KEY);
const { HttpError } = require('../../../middlewares/errors/http-error');
const { httpResponse } = require('../../../middlewares/http/http-response');
const { Shipping } = require('../../../model/User/shipping-address');
const { User } = require('../../../model/User/user');
const promoCode = require('../../admin/model/promo_code');


const german = process.env.SUPPORTED_LANGUAGE
const initiatePayment = async function initiatePayment(req,res,next){
  const {userId, language} = req.userData;
    try {
        const {total_amount,discount_code, user_points} = req.body;
       
        const shippingAddress = await Shipping.getAddress(userId);
        if (!total_amount) {
           const e = new HttpError(400, language==german?'Bitte geben Sie den Gesamtbetrag an':'Please provide total_amount');
           return next(e); 
        }
        if (!shippingAddress) {
            const e = new HttpError(400, language==german?'Sie haben nicht genügend Punkte. Bitte führen Sie eine Aufgabe aus oder laden Sie einen Benutzer ein, um Punkte zu sammeln':'You have insufficient points. Please perform task or invite a user to earn points');
           return next(e);   
        }
        let amountToPay; 
        const userAcct = User.findUserById(userId);
        if (user_points>userAcct.points) {
          const e = new HttpError(400, language==german?'Bitte fügen Sie Ihrem Konto eine Lieferadresse hinzu, um fortzufahren':'Please add a shipping address to your account to continue');
          return next(e);  
        }
        /***Reward the person that referred with 100 points */
        if (userAcct&&userAcct.referredBy&&userAcct.made_first_purchase==false) {
          User.findOneAndUpdate({referral_id: userAcct.referredBy}, {$inc:{points: 100}});  
          User.updateUserByEmail(userAcct.email,{$inc:{made_first_purchase:true}});
        }
        if (userAcct&&user_points>=100&&!discount_code) {
 
            if (user_points>=100&&user_points <200) {
                amountToPay = Number(total_amount) - (Number(total_amount)*0.1);
                console.log(amountToPay);
                const data = {
                 $inc: { points: -user_points } 
               } 
               User.updateUserByEmail(userAcct.email, data); 
            } else if(user_points>=200&&user_points <500){
                amountToPay =Number(total_amount) - (Number(total_amount)*0.15);
                const data = {
                 $inc: { points: -user_points } 
               } 
               User.updateUserByEmail(userAcct.email, data);  
            }else if (user_points>=500) {
                amountToPay = Number(total_amount) - (Number(total_amount)*0.2);;
                const data = {
                 $inc: { points: -user_points } 
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
                console.log(`${amountToPay} is here`);
            }
            }
        }
          console.log(`${amountToPay} changed`);
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



