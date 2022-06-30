const { HttpError } = require("../../../middlewares/errors/http-error");
const { deleteS3UploadedImage } = require("../../../middlewares/file-upload-helper/s3-bucket");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { pointSystem } = require("../../../model/points");



const german = process.env.SUPPORTED_LANGUAGE;
const rejectTask  = async function rejectTask(req,res,next){
    const {language} = req.userData;
    try {
        const {taskId} = req.params;
        const rejectedTask = await pointSystem.rejectTask(taskId);
        if (rejectedTask) {
            httpResponse({status_code: 200, response_message: language==german?'Sie haben diese Aufgabe erfolgreich abgelehnt und keine Punkte vergeben':"You have rejected this task successfully and no points awarded", data:rejectedTask, res});
            deleteS3UploadedImage({imageKey:rejectedTask.task, bucketName:'demo-bucket'})
        }else{
           return new(HttpError(400,language==german? 'Operation fehlgeschlagen':'Operation failed'));
        }
    } catch (error) {
        return next(new HttpError(400,  language==german?'Ein Fehler im System':"System error"));
    }
}

module.exports={
    rejectTask
}