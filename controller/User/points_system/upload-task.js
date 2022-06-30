const { HttpError } = require("../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { pointSystem } = require("../../../model/points");



const german = process.env.SUPPORTED_LANGUAGE;
const uploadTask = async function(req,res,next){
    const {userId, language} = req.userData;
    try {
        const {task}=req.body;
        if (!task) {
            return next(new HttpError(400, 'provides task'))
        }
        const newTask =await pointSystem.createTask({task, user:userId});
        if (newTask) {
           httpResponse({status_code:200, response_message:language!=german?'Task successfully uploaded. Awaiting review':'Aufgabe erfolgreich hochgeladen. Warten auf Überprüfung', data: newTask, res}) 
        }else{
            return  next(new HttpError(400,language==german? 'Aufgabe kann nicht hochgeladen werden. Versuchen Sie es später noch einmal':'Unable to upload task. Try again later'));
        }
    } catch (error) {
        return next(new HttpError(400,  language==german?'Ein Fehler im System':"System error"));
    }
}

module.exports={
    uploadTask
}