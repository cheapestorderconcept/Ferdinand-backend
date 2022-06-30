const express = require('express');
const { updateClientOrder } = require('../controller/admin/controller/Order/update-order');
const { deleteProducts } = require('../controller/admin/controller/product/delete-product');
const { updateProduct } = require('../controller/admin/controller/product/update-product');
const { uploadProduct } = require('../controller/admin/controller/product/upload-product');
const { getAllProduct } = require('../controller/admin/controller/product/view-product');
const { generateCode,  expiredCode } = require('../controller/admin/controller/product/promo-code');
const { uploadFileToServer, fetchImageFromServer } = require('../middlewares/file-upload-helper/image-uploading');
const { multerFileUpload } = require('../middlewares/file-upload-helper/multer-config');
const { verifyToken } = require('../middlewares/hashing/jwt');
const { sendGroupNotification } = require('../controller/User/Auth/firebase_notification');
const { acceptTask } = require('../controller/User/points_system/accept-task');
const { rejectTask } = require('../controller/User/points_system/reject-task');

const router = express.Router();






router.get('/download-image/:image_key/:bucket_name', fetchImageFromServer);

router.use(verifyToken);

router.post('/add-products',uploadProduct);
router.delete('/delete-product/:productId', deleteProducts)
router.put('/update-product/:productId', updateProduct)
router.post('/promo-code', generateCode);
router.post('/send-notification', sendGroupNotification);
router.delete('/expired-code', expiredCode);
router.get('/view-product', getAllProduct);
router.put('/update-client-order', updateClientOrder);
router.post('/upload-file/:bucket_name', multerFileUpload.single('file'),uploadFileToServer);
router.post('/accept-task/:taskId', acceptTask);
router.post('/reject-task/:taskId', rejectTask);

/***Admin upload image */




module.exports=router;