const { firebaseAppToken } = require("../../../model/firebase_notification_token");



const firebaseToken = async function addToken(req,res,next){
    try {
        console.log("here is app token");
        const {token} = req.body;
        const {userId} = req.userData;
        const userDevice = await firebaseAppToken.findOne({userId});
        if (userDevice) {
       //check if the loggedIn device remains the previous device
       if (userDevice.app_token!=token) {
           const updateToken = await firebaseAppToken.findOneAndUpdate({userId}, {app_token:token});
           res.sendStatus(200)
       }
        }else{
         const addDeviceToken = new firebaseAppToken({
             app_token: token,
             userId
         });
         addDeviceToken.save();
            //register the device
            res.sendStatus(200)
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(200)
    }
}

module.exports={
    firebaseToken
}