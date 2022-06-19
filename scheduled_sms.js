require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = require('twilio')(accountSid, authToken); 

async function sendScheduledSms(date, phone, message) {
    const sms = await client.messages.create({
      body: message,
      messagingServiceSid: messagingSid,      
      to: phone,
      scheduleType: 'fixed',
      sendAt: date
    });

    return sms.sid
}


module.exports = sendScheduledSms;