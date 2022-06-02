const { HttpError } = require("../../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../../middlewares/http/http-response");
const { productModel } = require("../../../../model/product");












const  german = process.env.SUPPORTED_LANGUAGE;


const deleteProducts = async function deleteProduct(req, res, next) {
    const {language} = req.userData;
    try {
        const { productId } = req.params;
        if (!productId) {
           const e = language == german ? new HttpError(400, 'productId fehlt in Ihren Anfrageparametern') : new HttpError(400, 'productId is missing in your request params');
           return next(e) 
        }
        const deletedProduct = await productModel.deleteProduct(productId);
        if (deletedProduct) {
            language == german ? httpResponse({ status_code: 200, response_message: 'Produkt erfolgreich gelöscht', data: { deletedProduct }, res }) : httpResponse({ status_code: 200, response_message: 'Product successfully deleted', data: { deletedProduct }, res });
        } else {
            const e = language == german ? new HttpError(400, 'Produkt kann im Moment nicht gelöscht werden') :  new HttpError(400, 'Unable to delete product at the moment');
            return next(e);
        }
    } catch (error) {
        console.log(error);
        const e = language == german ?  new HttpError(500, 'Interner Serverfehler. Bitte wenden Sie sich an den Support, wenn das Problem weiterhin besteht') :  new HttpError(500, 'Internal server error. Please contact support if persists');
        return next(e);
    }
}

module.exports = {
    deleteProducts
}