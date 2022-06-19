require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = require('twilio')(accountSid, authToken); 


const sendSms = (phone, message) => {
  client.messages
    .create({
        body: message,
        messagingServiceSid: messagingSid,      
        to: phone
     })
    .then(message => console.log(message.sid));
}

module.exports = sendSms;