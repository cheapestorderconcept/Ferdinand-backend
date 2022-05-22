
const joi = require('joi');
const { HttpError } = require('../../../../middlewares/errors/http-error');
const joiError = require('../../../../middlewares/errors/joi-error');
const { httpResponse } = require('../../../../middlewares/http/http-response');
const { productModel } = require('../../../../model/product');





const validation = joi.object({
    product_name: joi.string().required(),
    product_pictures: joi.string(),
    product_price: joi.string().required(),
    product_description: joi.string().required(),
    flash_sales: joi.boolean(),
    vat: joi.string(),
    about_product: joi.string(),
    product_categories: joi.string()
})

const uploadProduct = async function uploadProduct(req, res, next) {
    try {
        const bodyVal = await validation.validateAsync(req.body);
        const newproduct = await productModel.uploadProduct(bodyVal);
        if (newproduct) {
            httpResponse({ status_code: 201, response_message: 'Product has been successfully added', data: { newproduct }, res });
        } else {
            const e = new HttpError(500, 'An error occured when uploading the products. Please contact support if perists');
            return next(e);
        }
    } catch (error) {
       joiError(error, next);
    }
}


module.exports = {
    uploadProduct
}