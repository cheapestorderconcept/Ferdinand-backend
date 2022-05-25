const { HttpError } = require("../../../../middlewares/errors/http-error");
const { httpResponse } = require("../../../../middlewares/http/http-response");
const { productModel } = require("../../../../model/product");








const currentFlashSales = async function currentFlashSales(params) {
    try {
        const product = await  productModel.getProduct();
        const outofstock = product.filter(prod=>prod.flash_sales==true);
        httpResponse({status_code:200, response_message:'Product in sales', data:{outofstock},res});
    } catch (error) {
        const e = new HttpError(500, 'An internal system error occured. Please contact support');
        return next(e);
    }
}

const viewOutOfStock = async function viewOutOfStock(req,res,next) {
    try {
        const product = await  productModel.getProduct();
        console.log(product);
        const outofstock = product.filter(prod=>prod.product_quantity==0);
        httpResponse({status_code:200, response_message:'out of stock product', data:{outofstock},res});
    } catch (error) {
        const e = new HttpError(500, 'An internal system error occured. Please contact support');
        return next(e);
    }
}


const getAllProduct = async function getAllProduct(req,res,next) {   
    try {
        const product = await  productModel.getProduct();
        console.log(product);
        if (product&&product.length>0) {
            httpResponse({status_code:200, response_message:'Product available', data:{product}, res});
        }else{
            const e = new HttpError(400, 'You have not added any product to store. Please add product');
            return next(e);
        }
    } catch (error) {
        console.log(error);
        const e = new HttpError(500, 'A system error has occured. Please contact support if persists');
        return next(e);
    }
}

module.exports={
    getAllProduct,
    viewOutOfStock,
    currentFlashSales
}