
const joi = require('joi');
const { HttpError } = require('../../../middlewares/errors/http-error');
const joiError = require('../../../middlewares/errors/joi-error');
const { compareHash, hashingData } = require('../../../middlewares/hashing/password-hashing');
const { httpResponse } = require('../../../middlewares/http/http-response');
const { User } = require('../../../model/User/user');


const validation = joi.object({
    old_password: joi.string().required(),
    new_password: joi.string().required(),
    confirm_password: joi.string()
})

const changePassword = async function changePassword(req,res,next) {
    try {
        const { userId } = req.userData;
        const bodyValidation = await validation.validateAsync(req.body);
        const {old_password} = bodyValidation
        const user = await User.findUserById(userId);
        const checkOldPassword =await compareHash({ dataToCompare: old_password, hashedData: user.password }); 
        if (user) {
          
            if (!!checkOldPassword) {
                console.log(checkOldPassword);
                const hashed = await hashingData({ dataToHash: bodyValidation.new_password })
                const data = {
                    password: hashed
                }
                const updatedUser = await User.updateUser(userId, data);
                if (updatedUser) {
                    httpResponse({ status_code: 200, response_message: 'Password successfully changed', data: { updatedUser }, res })
                } else {

                    const e = new HttpError(400, 'Unable to change the password. Please contct support');
                    return next(e);
                }
            } else {
                const e = new HttpError(400, 'You have provided a wrong old password');
                return next(e);
            }
        }
    } catch (error) {
        console.log(error);
    
            joiError(error,next)

    }
}

module.exports = {
    changePassword
}