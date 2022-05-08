const express = require('express');
const { updateClientOrder } = require('../controller/admin/controller/Order/update-order');
const { deleteProducts } = require('../controller/admin/controller/product/delete-product');
const { updateProduct } = require('../controller/admin/controller/product/update-product');
const { uploadProduct } = require('../controller/admin/controller/product/upload-product');
const { getAllProduct } = require('../controller/admin/controller/product/view-product');
const { uploadFileToServer, fetchImageFromServer } = require('../middlewares/file-upload-helper/image-uploading');
const { multerFileUpload } = require('../middlewares/file-upload-helper/multer-config');
const { verifyToken } = require('../middlewares/hashing/jwt');

const router = express.Router();




router.post('/add-products',uploadProduct);

router.put('/update-product/:productId', updateProduct)
router.delete('/delete-product/:productId', deleteProducts)

router.post('/upload-file/:bucket_name', multerFileUpload.single('file'),uploadFileToServer);
router.get('/download-image/:image_key/:bucket_name', fetchImageFromServer);
router.use(verifyToken);
router.get('/view-product', getAllProduct);
router.put('/update-client-order', updateClientOrder);

/***Admin upload image */




module.exports=router;