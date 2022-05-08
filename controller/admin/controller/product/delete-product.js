const { HttpError } = require("../../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../../middlewares/http/http-response");
const { productModel } = require("../../../../model/product");















const deleteProducts = async function deleteProduct(req, res, next) {
    try {
        const { productId } = req.params;
        if (!productId) {
           const e = new HttpError(400, 'productId is missing in your request params');
           return next(e) 
        }
        const deletedProduct = await productModel.deleteProduct(productId);
        if (deletedProduct) {
            httpResponse({ status_code: 200, response_message: 'Product successfully deleted', data: { deletedProduct }, res });
        } else {
            const e = new HttpError(400, 'Unable to delete product at the moment');
            return next(e);
        }
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'Internal server error. Please contact support if persists');
        return next(e);
    }
}

module.exports = {
    deleteProducts
}