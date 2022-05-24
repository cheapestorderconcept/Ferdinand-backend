
const joi = require('joi');
const { HttpError } = require('../../../middlewares/errors/http-error');
const joiError = require('../../../middlewares/errors/joi-error');
const { signToken } = require('../../../middlewares/hashing/jwt');
const { hashingData } = require('../../../middlewares/hashing/password-hashing');
const { httpResponse } = require('../../../middlewares/http/http-response');
const { User } = require('../../../model/User/user');

const bodyValidation = joi.object({
    email: joi.string().email(),
    password: joi.string(),
    first_name: joi.string().required(),
    last_name: joi.string().required(), 
    phone_number: joi.string(),
})

const registerUser = async function registerUser(req,res,next) {
    try {
        const validation = await bodyValidation.validateAsync(req.body);
        const existingUser = await User.findUserByEmail(validation.email);
        if (existingUser) {
            const e = new HttpError(400, 'An account already exists with this email address');
            return next(e);
        }
        const hashedPassword = await hashingData({dataToHash: validation.password});
        const data = {
            password: hashedPassword,
        }
         const  newUser = await User.createNewUser(validation, data);
         if (newUser) {
             const payload = {
                 userId :newUser._id,
                 email: newUser.email,
                 role: newUser.role

             }
             const token =  signToken({payload});
            httpResponse({status_code:201, response_message:'Account successfully created', data:{newUser, token}, res});
         }else{
             const error = new HttpError(500, 'Unable to register new user at the moment. Contact support if persists');
             return next(error);
         }
    } catch (error) {
     joiError(error,next);
    }
}

module.exports={
    registerUser
}