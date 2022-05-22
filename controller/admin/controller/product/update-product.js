const { HttpError } = require("../../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../../middlewares/http/http-response");
const { productModel } = require("../../../../model/product");









const updateProduct = async function updateProduct(req, res, next) {
    try {
        const { productId } = req.params;
        if (!productId) {
            const e = new HttpError(400, 'ProductId should be passed has params');
            return next(e);
        }
        const { product_name, product_price, product_description,vat } = req.body;
        const data = {
            product_name, 
            product_price,
            vat,
            about_product: product_description,
        }
        const updatedProduct = await productModel.updateProduct(productId, data);
        if (updatedProduct) {
            httpResponse({ status_code: 200, response_message: 'Product available', data: { updatedProduct }, res });
        } else {
            const e = new HttpError(400, 'Unable to update product at the moment. Contact support if persists');
            return next(e);
        }
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'Unable to update product at the moment. Contact support if persists');
        return next(e);
    }
}

module.exports = {
    updateProduct
}