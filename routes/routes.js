const express = require('express');
const { changePassword } = require('../controller/User/Auth/change-password');
const { contactSupport } = require('../controller/User/Auth/contact-support');
const { loginUser } = require('../controller/User/Auth/login');
const { firebaseToken } = require('../controller/User/Auth/notification_token');
const { profile, deleteProfile,updateProfile } = require('../controller/User/Auth/profile');
const { resetPassword } = require('../controller/User/Auth/reset-password');
const { addShippingInfo, updateAddress, viewShippingAddress, deleteAddress } = require('../controller/User/Auth/shipping-address');
const { registerUser } = require('../controller/User/Auth/signup');
const { placeOrder } = require('../controller/User/order/place-order');
const { myOrder } = require('../controller/User/order/view-order');
const { initiatePayment } = require('../controller/User/payment/stripe');
const { addFavoritesProduct, favoritesList } = require('../controller/User/product/favorites');
const { recommendedProducts } = require('../controller/User/product/recommended_products');
const { userGetAllProduct, userGetSingleProduct, flashSalesProduct } = require('../controller/User/product/view-product');
const { addProductToWishList, viewWishlist } = require('../controller/User/product/wishlist');
const { verifyToken } = require('../middlewares/hashing/jwt');

const router = express.Router();


router.post('/signup',registerUser);
router.post('/login',loginUser);
router.post('/reset-password', resetPassword);

router.get('/view-products', userGetAllProduct);
router.get('/product-recommendation', recommendedProducts);
router.get('/flash-sales-products', flashSalesProduct);
router.get('/view-single-products/:productId', userGetSingleProduct);
router.use(verifyToken);
router.get('/profile', profile);
router.put('/update-profile', updateProfile)
router.delete('/delete-profile', deleteProfile);
router.post('/change-password', changePassword)
router.post('/support',contactSupport)
router.post('/add-wishlist', addProductToWishList)
router.post('/add-favorites',addFavoritesProduct)
router.get('/view-wishlist', viewWishlist)
router.get('/view-favorites', favoritesList)




router.post('/initiate-payment', initiatePayment);
router.post('/place-order', placeOrder);
router.get('/view-order?', myOrder);

router.post('/add-shipping-address', addShippingInfo);
router.put('/update-shipping-info/:addressId', updateAddress)
router.get('/view-shipping-info', viewShippingAddress)
router.delete('/delete-shipping-info/:addressId', deleteAddress);
router.post('/register-device', firebaseToken); //useful if notification is to be sent via server
module.exports=router;