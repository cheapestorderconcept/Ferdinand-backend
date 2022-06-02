const { amazonS3FileUpload, downloadS3UploadedFile } = require("./s3-bucket");
const { HttpError } = require("../errors/http-error");
const { httpResponse } = require("../http/http-response");


const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_REGION = process.env.AWS_REGION;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY

//

const fetchImageFromServer=(req,res,next)=>{
    try {
        console.log('downloading-image');
        const {image_key, bucket_name} = req.params;
        const downloadedImage = downloadS3UploadedFile({imageKey:image_key, bucketName:bucket_name});
        if(downloadedImage){
            return downloadedImage.pipe(res)
        }
       return next(new HttpError(404, 'No image exists with provided key'));
    } catch (error) {
        console.log(error);
        return next(new HttpError(500, 'Internal server error')); 
    }
}
const german = process.env.SUPPORTED_LANGUAGE
const uploadFileToServer=async(req,res,next)=>{
    try {
        const file = req.file;
        const {bucket_name}=req.params;
        const {language} = req.userData;
        if(!file)return next(new HttpError(400, 'Please select a picture to be uploaded'));
        if(!bucket_name)return next(new HttpError(400, 'Please provide a bucketName'));
        const uploadedFile = await amazonS3FileUpload({file,AWS_ACCESS_KEY_ID,AWS_BUCKET_NAME:bucket_name,AWS_REGION,AWS_SECRET_ACCESS_KEY});
        httpResponse({status_code: 200, response_message: language==german?'Bild erfolgreich hochgeladen':'Image successfully uploaded',data: uploadedFile,res}); 
      
    } catch (error) {
        console.log(error);
       const err = new HttpError(500,'Product picture not successfully uploaded');
       return next(err);
    }
}

const deleteImageFromServer=()=>{

    try {
        
    } catch (error) {
        
    }
}


module.exports={
 uploadFileToServer,
 fetchImageFromServer,
 deleteImageFromServer
}