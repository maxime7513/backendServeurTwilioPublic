require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken); 

async function sendScheduledSms(date, phone, message) {
    const sms = await client.messages.create({
      body: message,
      messagingServiceSid: 'MG7647de62283c642f5ec58b3a95fdd080',      
      to: phone,
      scheduleType: 'fixed',
      sendAt: date
    });

    return sms.sid
}


module.exports = sendScheduledSms;