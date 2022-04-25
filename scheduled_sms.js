require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken); 

// const sendWhen = new Date(new Date().getTime() + 61 * 60000);

// const sendSms = (phone, message) => {
//     client.messages 
//       .create({ 
//          body: message,  
//         //  body: 'Cest un rapel pour votre créneau',  
//          messagingServiceSid: 'MG7647de62283c642f5ec58b3a95fdd080',      
//          to: phone,
//         //  to: '+33687262395',
//         //  scheduleType: 'fixed',
//         //  sendAt: sendWhen.toISOString(),
//        }) 
//       .then(message => console.log(message.sid)) 
//       .done();
// }
const sendSms = (date, phone, message) => {
    client.messages
      .create({
        body: message,
        // messagingServiceSid: 'MG7647de62283c642f5ec58b3a95fdd080',      
        messagingServiceSid: 'MGb01c041156f36c44e6c4281c2db58a4d',   
        to: phone,
        scheduleType: 'fixed',
        sendAt: date
       })
      .then(message => console.log(message.sid));
  }

module.exports = sendSms;