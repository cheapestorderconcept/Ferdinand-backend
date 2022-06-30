const { HttpError } = require("../../../middlewares/errors/http-error");
const { deleteS3UploadedImage } = require("../../../middlewares/file-upload-helper/s3-bucket");
const { httpResponse } = require("../../../middlewares/http/http-response");
const { pointSystem } = require("../../../model/points");
const { User } = require("../../../model/User/user");


const german = process.env.SUPPORTED_LANGUAGE;
const acceptTask = async function acceptTask(req,res,next){
    const {language} = req.userData;
    try {
       const {taskId} = req.params;
       const {point}= req.body;
       if (!taskId) {
          return next(new HttpError(400,language==german? 'Geben Sie die Task-ID an':' provide taskId')) 
       }
        const task =  await pointSystem.taskDetails(taskId);  
        if (task) {
            const { user} = task;
           await  User.findOneAndUpdate({_id:user}, {points:point});
           await  pointSystem.findOneAndDelete({_id: taskId});
            httpResponse({status_code:200, response_message:language==german?`Aufgabe angenommen und ${point} vergeben`:`Task accepted and ${point} awarded`, data:{}, res});
            deleteS3UploadedImage({imageKey:task.task, bucketName:'demo-bucket'});
        }else{
            return next(new HttpError(400, language==german?'Die Aufgabe kann nicht angenommen werden':'Unable to accept the task'));
        }

    } catch (error) {
        
    }
}

module.exports={
    acceptTask
}