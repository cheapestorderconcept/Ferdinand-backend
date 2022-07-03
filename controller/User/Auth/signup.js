
const joi = require('joi');
const { HttpError } = require('../../../middlewares/errors/http-error');
const joiError = require('../../../middlewares/errors/joi-error');
const { signToken } = require('../../../middlewares/hashing/jwt');
const { hashingData } = require('../../../middlewares/hashing/password-hashing');
const { httpResponse } = require('../../../middlewares/http/http-response');
const { User } = require('../../../model/User/user');
const ejs = require("ejs");
const path = require("path");
const { referralAlert } = require('../../sengiridMessages/email-verification');
const bodyValidation = joi.object({
    email: joi.string().email(),
    password: joi.string(),
    language: joi.string().required(),
    referral_id: joi.any(),
    first_name: joi.string().required(),
    last_name: joi.string().required(), 
    phone_number: joi.string(),
});

const registerUser = async function registerUser(req,res,next) {
    try {
        const validation = await bodyValidation.validateAsync(req.body);
        const existingUser = await User.findUserByEmail(validation.email);
        const {language, referral_id} = validation; 
        if (referral_id) {
          const referral = await User.findOne({referral_id});
          if (referral) {
              const data = {
                $inc: { accumulated_points: 100 } 
              } 
              const {first_name} = referral;
              User.updateUserByEmail(referral.email, data); //award points to referral
              ejs.renderFile(path.join(__dirname, "../../../views/referral-email.ejs"), {
                order: [],
                first_name,
                last_name,
                address,
                phone_number,
            },{})
            .then(result=>{
              referralAlert(result, first_name); 
            }).catch((err)=>{
                console.log(err);
            });
          }  
        }
        if (existingUser) {
            const e = new HttpError(400, language==process.env.SUPPORTED_LANGUAGE?'Mit dieser E-Mail-Adresse existiert bereits ein Konto':'An account already exists with this email address');
            return next(e);
        }
        const hashedPassword = await hashingData({dataToHash: validation.password});
        const data = {
            password: hashedPassword,
        }
         const  newUser = await User.createNewUser(validation, data);
         if (newUser) {
       if (referral_id) {
         User.updateUserByEmail(validation.email, {referred_by: referral_id})  
       }
             const payload = {
                 userId :newUser._id,
                 email: newUser.email,
                 role: newUser.role,
                 language
             }
            const token =  signToken({payload});
        httpResponse({status_code:201, response_message:language==process.env.SUPPORTED_LANGUAGE?'Konto erfolgreich erstellt':'Account successfully created', data:{newUser, token}, res});
         }else{
             const error = new HttpError(500, language==process.env.SUPPORTED_LANGUAGE?'Im Moment kann kein neuer Benutzer registriert werden. Wenden Sie sich an den Support, wenn das Problem weiterhin besteht':'Unable to register new user at the moment. Contact support if persists');
             return next(error);
         }
    } catch (error) {
     joiError(error,next);
    }
}

module.exports={
    registerUser
}