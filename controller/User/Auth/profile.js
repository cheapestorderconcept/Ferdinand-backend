const { HttpError } = require('../../../middlewares/errors/http-error');
const { httpResponse } = require("../../../middlewares/http/http-response");
const { User } = require("../../../model/User/user");





const profile = async function profile(req,res,next) {
    try {
        const {userId} = req.userData;
        const user = await User.findUserById(userId);
        if (user) {
            httpResponse({status_code:200, response_message:'Profile found', data:{user},res});
        }else{
            const e = new HttpError(404, 'This account has probably being deleted');
            return next(e)
        }
    } catch (error) {
         const e = new HttpError(500, 'Internal server error. Please contact support');
         return next(e);
    }
}

const deleteProfile = async function deleteProfile(req,res,next) {
    try {
        const {userId} = req.userData;
        const user = await User.deleteUser(userId);
        if (condition) {
         httpResponse({status_code:200, response_message:'Your account has been successfully deleted', data:{user},res});
        }else{
         const e = new HttpError(500, 'We are unable to delete your account at the moment. Please contact support');
         return next(e);  
        }
    } catch (error) {
        
    }
}

module.exports={
    profile,
    deleteProfile
}