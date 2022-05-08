
const s3 = require('aws-sdk/clients/s3');


const path = require('path');
const { HttpError } = require('../errors/http-error');

const s3Config = new s3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.STORJ_GATEWAY,
    httpOptions: { timeout: 0,  },
    s3ForcePathStyle: true,
    signatureVersion: "v4",

});

const downloadS3UploadedFile =function downloadImageFromS3Bucket ({ imageKey, bucketName }) {
    try {
        const uploadedImageParams = {
           Key: imageKey,
            Bucket:bucketName
        }
        return s3Config.getObject(uploadedImageParams).createReadStream();
        
    } catch (error) {
       
        throw new Error(error);
    }
}


const deleteS3UploadedImage = ({ imageKey, bucketName }) => {
    try {
        const uploadedImageParams = {
            imageKey,
            bucketName
        }
        return s3Config.deleteObject(uploadedImageParams).promise()
    } catch (error) {

    }
}


/***
        * @description Uploading file to s3 bucket. images are uploaded to specified bucket name
        */
const amazonS3FileUpload = async function uploadImageToS3Bucket({ file,AWS_BUCKET_NAME }){
    try {
        let fileName =
        path.basename(file.originalname, path.extname(file.originalname)) +
        "-" +
        Date.now() +
        path.extname(file.originalname);
        const uploadParams = {
            Bucket: AWS_BUCKET_NAME,
            Body: file.buffer,
            Key: fileName
        }
        return s3Config.upload(uploadParams).promise()
    } catch (error) {
        throw new HttpError(500, error.message);

    }
}



module.exports = {
    amazonS3FileUpload,
    downloadS3UploadedFile,
    deleteS3UploadedImage
}