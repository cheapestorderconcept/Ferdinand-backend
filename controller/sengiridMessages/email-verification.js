const { sendEmail } = require("../../middlewares/sendGridEmail/email-config");


const OrderPlacementAlert = async ( emailTemplate,firstName, email) => {  
  sendEmail("cheapestorderconcept@gmail.com",process.env.SUPPORT_EMAIL,emailTemplate,`New Order alert from ${firstName}`);
  }


  const ClientOrderAlert = async ( emailTemplate,firstName, email) => {  
    sendEmail(email,process.env.SUPPORT_EMAIL,emailTemplate,`New Order alert from ${firstName}`);
    }
  module.exports={
      OrderPlacementAlert,
      ClientOrderAlert
  }