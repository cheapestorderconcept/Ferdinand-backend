
const mongoose = require('mongoose');
const schema = mongoose.Schema;



const productSchema = new schema({
    product_name: {type:String, required:true},
    product_price: {type: Number, required:true},
    views: {type:Number, default:0},
    units: {type:String},
    discount: {type:Number},
    status: {type:String},
    about_product:{type:String},
    vat: {type:Number},
    product_variants: {type:Array},
    product_description: {type:String, required:true},
    product_categories : {type: String, required:true},
    product_reviews: [],
    product_quantity: {type:Number, default:0},
    product_pictures: {type:String, required: true},
    flash_sales: {type:Boolean, default:false}
},{
    timestamps:true
});




productSchema.statics.uploadProduct = async function uploadProduct(productDetails) {
    const product =  new productModel(productDetails);
    const newProduct = await product.save();
    return newProduct;
}


productSchema.statics.updateProduct = async function updateProduct(productId, data) {
    const product = await productModel.findOneAndUpdate({_id:productId}, data,{upsert:true, new:true});
    return product;
}


productSchema.statics.getProduct = async function getProduct() {
    const product = await productModel.find({});
    return product;
}

productSchema.statics.getSingleProduct = async function getSingleProduct(productId) {
    const product = await productModel.findOne({_id:productId});
    return product;
}
productSchema.statics.deleteProduct = async function deleteProduct(productId) {
    const product = await productModel.findOneAndDelete({_id:productId})
    return product;
}


const productModel = mongoose.model('product', productSchema);

module.exports={
    productModel
}