const { HttpError } = require('../../../middlewares/errors/http-error');
const { httpResponse } = require("../../../middlewares/http/http-response");
const { User } = require("../../../model/User/user");



const  german = process.env.SUPPORTED_LANGUAGE;


const profile = async function profile(req,res,next) {
    const {language} = req.userData;
    try {
        const {userId} = req.userData;
        const user = await User.findUserById(userId);
        if (user) {
           language == german ? httpResponse({status_code:200, response_message:'Profil gefunden', data:{user},res}) : httpResponse({status_code:200, response_message:'Profile found', data:{user},res});
        }else{
            const e = language == german ? new HttpError(404, 'Dieses Konto wurde wahrscheinlich gelöscht') : new HttpError(404, 'This account has probably being deleted');
            return next(e)
        }
    } catch (error) {
         const e = language == german ?  new HttpError(500, 'Interner Serverfehler. Bitte wenden Sie sich an den Support') :  new HttpError(500, 'Internal server error. Please contact support');
         return next(e);
    }
}

const updateProfile = async function updateProfile(req,res,next){
    const {language} = req.userData;
    try {
        const {data} = req.body;
        
        const {userId} = req.userData;
        const updatedProfile = await User.updateUser(userId, data);
        if (updatedProfile) {
            language == german ? httpResponse({status_code:200, response_message:"Profil erfolgreich aktualisiert", res}) : httpResponse({status_code:200, response_message:"Profile successfully updated", res});
        } else {
          return next(language == german ? new HttpError(500, "Ihr Profil kann nicht aktualisiert werden. Kontaktieren Sie Support") : new HttpError(500, "Unable to update your profile. Contact support")) ;
        }
    } catch (error) {
        return next(language == german ? new HttpError(500, "Ihr Profil kann nicht aktualisiert werden. Kontaktieren Sie Support") : new HttpError(500, "Unable to update your profile. Contact support")) ;
    }
}

const deleteProfile = async function deleteProfile(req,res,next) {
    const {language} = req.userData;
    
    try {
        const {userId} = req.userData;
        const user = await User.deleteUser(userId);
        if (condition) {
         language == german ? httpResponse({status_code:200, response_message:'Ihr Konto wurde erfolgreich gelöscht', data:{user},res}) : httpResponse({status_code:200, response_message:'Your account has been successfully deleted', data:{user},res});
        }else{
         const e = language == german ? new HttpError(500, 'Wir können Ihr Konto derzeit nicht löschen. Bitte wenden Sie sich an den Support') : new HttpError(500, 'We are unable to delete your account at the moment. Please contact support');
         return next(e);  
        }
    } catch (error) {
        
    }
}

module.exports={
    profile,
    updateProfile,
    deleteProfile
}