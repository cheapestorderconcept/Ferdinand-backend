

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const sendEmail = async(receiver_email, sender_email, email_body, email_subject)=>{

    const msg = {
        to: receiver_email, // Change to your recipient
        from: {email:sender_email, name: "DartCash", }, // Change to your verified sender
        
        subject: email_subject,
        text: 'and easy to do anywhere, even with Node.js',
        html: email_body,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
  }

  module.exports={
      sendEmail
  }