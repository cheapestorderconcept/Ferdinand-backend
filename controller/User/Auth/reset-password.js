

const joi = require('joi');
const { HttpError } = require('../../../middlewares/errors/http-error');
const joiError = require('../../../middlewares/errors/joi-error');
const { hashingData } = require('../../../middlewares/hashing/password-hashing');
const { httpResponse } = require('../../../middlewares/http/http-response');
const {sendEmail} = require('../../../middlewares/sendGridEmail/email-config');
const { passReset } = require('../../../model/User/password-reset');
const { User } = require('../../../model/User/user');


const verification = joi.object({
    email: joi.string()
})


const EMAIL_VERIFICATION_ALERT = async ( user_email,token,last_name,first_name) => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const registration_date = date.toLocaleDateString("en-US", options);
    const emailBody = `
      <div style="background-color: #fff; margin: 0 auto;">
        <p style="font-size: 14px;">Dear ${last_name} ${first_name}.  Kindly find below your activation token
        </p>
        <strong>
        <h2 style="font-size: 16px; color: green">Email Activation Request</h2>
      <p  style="font-size: 14px"> Activation Otp: ${token} </p>
       <p style="font-size: 16px">  Creation Date: ${registration_date}  </p>
       <p style="font-size: 16px">  Expires : 20 Minutes  </p>
         </strong>
         </p>
        </p>
        <p style="font-size: 14px;">Verify your email and enjoy 100 NGN deposit bonus</p>
        <strong><p>Cheapest Order Concepts|DartCash Team</p></strong>
  `
  
    sendEmail(user_email,process.env.EMAIL_USERNAME,emailBody,`Email Activation ${registration_date}`)
  }

const  german = process.env.SUPPORTED_LANGUAGE;

const sendEmailVerification = async function sendVerification(req,res,next) {
    const {language} = req.userData;
    try {
        const val = await verification.validateAsync(req.body);
        const user = await User.findUserByEmail(val.email)
        const codeDetals ={
            code: '4567890',
            email: user.email
        }
        const saveCode = await passReset.savePassCode(codeDetals);
        if (saveCode) {
            EMAIL_VERIFICATION_ALERT(val.email, 'ghjkl', user.first_name.user.last_name);  
        }else{
            const e = language == german ? new HttpError(500, 'Bestätigungscode kann im Moment nicht gesendet werden. Bitte versuchen Sie es später erneut') : new HttpError(500, 'Unable to send verification code at the moment. Please try again later');
            return next(e);
        }

        
    } catch (error) {
        joiError(error, next);
    }
}

const passValidation = joi.object({
    verification_code: joi.string().required(),
    new_password:  joi.string().required(),
    confirm_password: joi.string()
});

const resetPassword = async function resetPassword(req,res,next) {
    const {language} = req.userData;
    try {
        const bodyVal = await passValidation.validateAsync(req.body);
        const hashPass  = await hashingData({dataToHash: bodyVal.new_password});
        const data = {
            password: hashPass
        }
        const passCode = await passReset.getCode(bodyVal.verification_code);
        if(!passCode){
            const e = language == german ? new HttpError(400, 'Der eingegebene Code ist wahrscheinlich abgelaufen') : new HttpError(400, 'The code you entered has probably expired');
            return next(e);
        }
        const user= await User.updateUserByEmail(passCode.email, data);

        if (user) {
            language == german ? httpResponse({status_code:200, response_message:'Passwort erfolgreich zurückgesetzt', res}) : httpResponse({status_code:200, response_message:'Password reset successfully', res});
        }else{
            const e = language == german ? new HttpError(400, 'Ihr Passwort kann nicht zurückgesetzt werden. Bitte versuchen Sie es später erneut') : new HttpError(400, 'Unable to reset your password. Please try again later');
            return next(e); 
        }
    } catch (error) {
        joiError(error, next);
    }
}


module.exports={
    sendEmailVerification,
    resetPassword
}