const firebaseAdmin = require("firebase-admin");
const serviceAccounts = require("./service_account");



const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
}

 firebaseAdmin.initializeApp({
     credential:firebaseAdmin.credential.cert(serviceAccounts),
 });

 

 const sendMessageToDevice = function  sendMessageToSingleDevice({deviceToken, message}){  
    try {
     firebaseAdmin.messaging().sendToDevice(deviceToken, message, notification_options)
     .then((notificationSent)=>{

        // console.log(notificationSent);
     })
     .catch((error)=>{
         console.log(error);
     })
    } catch (error) {       
        console.log(error);
    }

 }


 module.exports={
     sendMessageToDevice
 }