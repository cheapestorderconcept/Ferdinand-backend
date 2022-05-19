const { HttpError } = require("../../../middlewares/errors/http-error");
const { sendMessageToDevice } = require("../../../middlewares/Firebase-notification/firebase_notification");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { firebaseAppToken } = require("../../../model/firebase_notification_token");



const firebaseToken = async function addToken(req,res,next){
    try {
        const {token} = req.body;
        const userDevice = await firebaseAppToken.findOne({app_token: token});
        if (userDevice) {
            res.sendStatus(200);
        }else{
         const addDeviceToken = new firebaseAppToken({
             app_token: token,
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


const  sendGroupNotification = async function sendGroupNotification(req,res,next){
    try {
        const deviceToken = await firebaseAppToken.find({});
        const token = [];
        for (let index = 0; index < deviceToken.length; index++) {
           token.push(deviceToken[index].app_token);
        }
        const {message} = req.body;
        if (!message) {
            return next(new HttpError(400, "Please provide message and title to be broadcast"));   
        }
         sendMessageToDevice({deviceToken:token, message:{notification:{body:message, title:"Ferdinandcoffee"}}});
         httpResponse({status_code:200, response_message:"Message sent to all users",data:{}, res});
    } catch (error) {
        return next(new HttpError(500, "Unable to send message contact support if persists"));
    }
}

module.exports={
    firebaseToken, 
    sendGroupNotification
}