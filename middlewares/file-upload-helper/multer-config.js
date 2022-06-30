
const multer = require('multer');
const { HttpError } = require('../errors/http-error');






const fileFilter =(req,file,cb)=>{
    if (file.mimetype==='image/jpeg'||file.mimetype==='image/png'||file.mimetype=='video/mp4') {
        cb(null, true);
    } else {
        cb(new HttpError(400,'Only Jpeg or png file allowed. Invalid file type choosen'), false)
        
    }
}



const multerFileUpload = multer({ storage:multer.memoryStorage(),limits:{fileSize: 1024 * 1024 * 20}, fileFilter:fileFilter});

module.exports={
    multerFileUpload
}