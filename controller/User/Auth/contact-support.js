const { HttpError } = require('../../../middlewares/errors/http-error');
const { httpResponse } = require("../../../middlewares/http/http-response");
const { sendEmail } = require("../../../middlewares/sendGridEmail/email-config");
const { User } = require("../../../model/User/user");


const SupportMessage = async (message_body,last_name,first_name,customer_email, customer_number, subject) => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const sending_date = date.toLocaleDateString("en-US", options);
    const emailBody = `
      <div style="background-color: #fff; margin: 0 auto;">
        <p style="font-size: 14px;">Hi,  ${last_name} ${first_name}. 
        Just requested for a support session. Below is the message containing their request
        Reply to this request by sending an email to: ${customer_email}
        Or Call this client on : ${customer_number}
        </p>
        <strong>
         </strong>
         </p>
         <p style="font-size: 16px">${message_body} </p>
        </p>
        <strong><p></p></strong>
  `

  const response = await   sendEmail(process.env.RECEIVER_EMAIL,process.env.SUPPORT_EMAIL,emailBody,`${subject} from  ${first_name}`);
  return response;
    
  }



const contactSupport = async function contactSupport(req,res,next) {
        try {
            const {message_body, subject} = req.body;
            const {email} = req.userData;
            const   user = await User.findUserByEmail(email);
            if (!message_body) {
                const e = new HttpError(400, 'Please provides message body');
                return next(e);
            }
            await SupportMessage(message_body, user.first_name, user.last_name,user.email,user.phone_number, subject);
            httpResponse({status_code:200, response_message:'Your request has been successfully sent. A replied will be provided shortly', res});
         
        } catch (error) {
          console.log(error);
            const e = new HttpError(500, 'A system error occured when sending message. Please contact support if persists');
            return next(e);
        }
}


module.exports={
    contactSupport
}