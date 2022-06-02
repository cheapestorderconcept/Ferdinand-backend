
const joi = require('joi');
const { HttpError } = require('../../../../middlewares/errors/http-error');
const joiError = require('../../../../middlewares/errors/joi-error');
const { httpResponse } = require('../../../../middlewares/http/http-response');
const { productModel } = require('../../../../model/product');





const validation = joi.object({
    product_name: joi.string().required(),
    product_pictures: joi.string(),
    product_variants: joi.array().min(1),
    product_description: joi.string().required(),
    vat: joi.string(),
    about_product: joi.string(),
    product_categories: joi.string()
})

const  german = process.env.SUPPORTED_LANGUAGE;
const uploadProduct = async function uploadProduct(req, res, next) {
    try {
        const bodyVal = await validation.validateAsync(req.body);
        const {language} = req.userData;
        const newproduct = await productModel.uploadProduct(bodyVal);
        if (newproduct) {
            language== german? httpResponse({ status_code: 201, response_message: 'Produkt wurde erfolgreich hinzugefügt', data: { newproduct }, res }):  httpResponse({ status_code: 201, response_message: 'Product has been successfully added', data: { newproduct }, res });
           
        } else {
            const e = language == german ? new HttpError(500, 'Beim Hochladen der Produkte ist ein Fehler aufgetreten. Bitte wenden Sie sich an den Support, wenn das Problem weiterhin besteht') : new HttpError(500, 'An error occured when uploading the products. Please contact support if perists');
            return next(e);
        }
    } catch (error) {
       joiError(error, next);
    }
}


module.exports = {
    uploadProduct
}