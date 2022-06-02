const { HttpError } = require("../../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../../middlewares/http/http-response");
const { productModel } = require("../../../../model/product");





const  german = process.env.SUPPORTED_LANGUAGE;

const updateProduct = async function updateProduct(req, res, next) {
    const {language} = req.userData;
    try {
        const { productId } = req.params;
        if (!productId) {
            const e  =new HttpError(400, language == german ? 'ProductId sollte übergeben werden hat Parameter':'ProductId should be passed has params')
            return next(e);
        }
        const { product_name, product_variants, product_description,vat } = req.body;
        const data = {
            product_name, 
            product_variants,
            vat,
            about_product: product_description,
        }
        const updatedProduct = await productModel.updateProduct(productId, data);
        if (updatedProduct) {
    httpResponse({ status_code: 200, response_message: language==german?'Produkt verfügbar':'Product available', data: { updatedProduct }, res }) 
        } else {
            const e =  new HttpError(400,  language == german ?'Das Produkt kann derzeit nicht aktualisiert werden. Wenden Sie sich an den Support, wenn das Problem weiterhin besteht':'Unable to update product at the moment. Contact support if persists')
            return next(e);
        }
    } catch (error) {
        console.log(error);
        const e =  new HttpError(400,  language == german ?'Das Produkt kann derzeit nicht aktualisiert werden. Wenden Sie sich an den Support, wenn das Problem weiterhin besteht':'Unable to update product at the moment. Contact support if persists')
        return next(e);
    }
}

module.exports = {
    updateProduct
}