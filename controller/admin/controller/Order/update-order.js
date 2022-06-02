
const { HttpError } = require('../../../../middlewares/errors/http-error');
const { httpResponse } = require('../../../../middlewares/http/http-response');
const { orderModel, orderStatus } = require('../../../../model/order');


const  german = process.env.SUPPORTED_LANGUAGE;

const updateClientOrder = async function updateClientOrder(req,res,next) {
    const {language} = req.userData;
    try {
        const {orderId} = req.query;
        if (!orderId|| typeof orderId ==null) {
            const e = language == german ? new HttpError(400, "OrderId fehlt in Ihren Abfrageparametern") : new HttpError(400, "OrderId is missing in your query params");
            return next(e);
        }
        const {order_status, tracking_number, total_price, logistic_name, logistic_website} = req.body;
        const data ={
            order_status,
            tracking_number,
            logistic_name,
            logistic_website,
            total_price
        }
        if (!tracking_number) {
            const e = language == german ? new HttpError(400, 'Bitte geben Sie die Sendungsnummer an') : new HttpError(400, 'Please provide tracking number');
            return next(e);
        }else if(!order_status){
            const e = language == german ? new HttpError(400, 'Bitte geben Sie den Bestellstatus an') : new HttpError(400, 'Please provide order status');
            return next(e);
        }else if(!logistic_name){
            const e = language == german ?  new HttpError(400, 'Bitte geben Sie die Namensnummer des Logistikunternehmens an') :  new HttpError(400, 'Please provide logistic company name number');
            return next(e);
        }
        const acceptedStatus = Object.values(orderStatus);
        if (acceptedStatus.includes(order_status)==false) {
          const e  =  language == german ? new HttpError(400, "Der in Ihrer Anfrage angegebene Bestellstatus wird nicht akzeptiert. Bitte überprüfen Sie das Dokument auf den akzeptierten Status") :  new HttpError(400, "The orderstatus supplied in your query is not accepted. Please check doc for accepted status");
          return next(e);
        }
        const updatedOrder  =await  orderModel.updateOrder(orderId, data);
        if (updatedOrder) {
            language == german ? httpResponse({status_code:200, response_message:'Die Bestellung wurde erfolgreich geändert', data:{updatedOrder}, res}) : httpResponse({status_code:200, response_message:'Order has been successfully modified', data:{updatedOrder}, res});
            return;
        }
        const e = language == german ? new HttpError(500, 'Diese Bestellung kann nicht aktualisiert werden. Bitte wenden Sie sich an den Support, wenn das Problem weiterhin besteht') : new HttpError(500, 'Unable to update this order. Please contact support if persists');
        return next(e);
    } catch (error) {
        joiError(error,next);
    }
}

module.exports={
    updateClientOrder
}