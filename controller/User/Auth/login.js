
const joi = require('joi');
const { HttpError } = require('../../../middlewares/errors/http-error');
const { signToken } = require('../../../middlewares/hashing/jwt');
const { compareHash } = require('../../../middlewares/hashing/password-hashing');
const { httpResponse } = require('../../../middlewares/http/http-response');
const { User } = require('../../../model/User/user');

const validation = joi.object({
    email: joi.string().email().trim(),
    password: joi.string(),
    language: joi.string().required()
})

const german = process.env.SUPPORTED_LANGUAGE 
const loginUser = async function loginUser(req,res,next){
        const {language} = req.body; 
        console.log(german);
    try {
        const bodyValidation = await validation.validateAsync(req.body);
        const {email, password} = bodyValidation;
        const existingUser =  await User.findUserByEmail(email);
        if (existingUser) {
       const passwordCheck = await compareHash({dataToCompare: password, hashedData: existingUser.password});
       if (!!passwordCheck) {
           const payload = {
               email: existingUser.email,
               userId: existingUser._id,
               role: existingUser.role,
               language
           }
           const token = signToken({payload});
           httpResponse({status_code:200, response_message:'', data:{existingUser, token}, res});
       }else{
        const e = new  HttpError(401,language==german?'Sie haben ungültige Anmeldeinformationen eingegeben. Entweder E-Mail oder Passwort ist falsch': 'You have entered an invalid credentials. Either email or password is wrong');
        return next(e);
       }
        }else{
          const e = new  HttpError(404,language==german?'Für die angegebene E-Mail-Adresse existiert kein Benutzer': 'No user exist for the provided email');
          return next(e);
        }
    } catch (error) {
        console.log(error);
        const errors = new HttpError(500,language==german?'Beim Anmelden des Benutzers ist ein Fehler aufgetreten. Wenden Sie sich an den Support, wenn das Problem weiterhin besteht': 'An error occured when login the user. Contact support if persists');
        return next(errors);
    }
}

module.exports={
    loginUser
}