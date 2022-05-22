const joi = require('joi');
const { HttpError } = require('../../../middlewares/errors/http-error');
const joiError = require('../../../middlewares/errors/joi-error');
const { httpResponse } = require('../../../middlewares/http/http-response');
const { Shipping } = require('../../../model/User/shipping-address');

const val = joi.object({
    phone_number : joi.string().required(),
    first_name: joi.string(),
    last_name: joi.string(),
    address: joi.string().required(),
    land_region: joi.string(),
    zip_code: joi.string()
    
})



const addShippingInfo = async function addShippingInfo(req,res,next) {  
    console.log("reaching here");
    try {
    const bodyVal = await val.validateAsync(req.body);
    const {userId} = req.userData;
    const details = {
        user: userId,
        ...bodyVal
    }
    const existingAdd = await Shipping.getAddress(userId);  
  
        if (!existingAdd) {
            console.log(existingAdd);
            const newAddress = await Shipping.addShippingAddress(details);
            if (newAddress) {
                httpResponse({status_code:201, response_message:'Your shipping address has been successfully added', data:{newAddress},res});
                return   
            }
           
        }else{
          
            const updatedAddress = await Shipping.updateAddress(existingAdd._id, details);
            
            if (updatedAddress) {
                console.log("i am updated");
                console.log(updatedAddress);
                httpResponse({status_code:200, response_message:'Address successfully updated', data:{},res});
                return  
            } else {
               return next(new HttpError(400, "Address not updated")); 
            }
            
        }
        const e = new HttpError(500, 'We are unable to add your shipping address at the moment. Please contact support if persists');
        return next(e);
    } catch (error) {
        console.log('here');
    joiError(error,next);
    }
}

const updateVal = joi.object({
    shipping_details:{
        reciever_phone_number:joi.string().required(), 
        postal_code:joi.string().required(), 
        reciever_name: joi.string().required(), 
        address:joi.string().required(),
        country: joi.string().required()
    }
})
const updateAddress = async function updateAddress(req,res,next) {
    try {
        const updateValidation = await updateVal.validateAsync(req.body);
     const {addressId} = req.params;   
     if (!addressId) {
         const e = new HttpError(400, 'addressId is missing from your request');
         return next(e);
     } 
     const updatedAddress = await Shipping.updateAddress(addressId, req.body.shipping_details);
     if (updatedAddress) {
        httpResponse({status_code:200, response_message:'Your address in record has been successfully updated', data:{updatedAddress}, res});
        return
     }
    } catch (error) {
      console.log(error);
        joiError(error, next)
    }
}

const deleteAddress = async function deleteAddress(req,res,next) {
    try {
        const {addressId} = req.params
        if (!addressId) {
          const e = new HttpError(400, 'addressId is missing in your request params');
          return next(e);  
        }
        const deletedAddress = Shipping.deleteAddress(addressId);
        if (deletedAddress) {
            httpResponse({status_code:200, response_message:'Shipping address successfully deleted', res});
            return;
        }
        const e = new HttpError(500, 'We are unable to delete your shipping address on records. Please try again later');
        return next(e);
    } catch (error) {
        joiError(error, next);
    }
}

const viewShippingAddress = async function viewShippingAddress(req,res,next) {
    try {
        const {userId} = req.userData;
        const shippingAddress = await Shipping.getAddress(userId);
        if (shippingAddress) {
            httpResponse({status_code:200, response_message:'Shipping address available', data:{shippingAddress}, res});
            return;
        }
        const e = new HttpError(400, 'You don\'t have any shipping address in records for now. Please add');
        return next(e);
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'An internal system error occured. Please contact support if persists');
        return next(e);
    }
}

module.exports={
    addShippingInfo,
    viewShippingAddress,
    updateAddress,
    deleteAddress
}