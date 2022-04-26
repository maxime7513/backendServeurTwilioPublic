require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken); 

async function sendScheduledSms(date, phone, message) {
    const sms = await client.messages.create({
      body: message,
      messagingServiceSid: 'MGb01c041156f36c44e6c4281c2db58a4d',      
      to: phone,
      scheduleType: 'fixed',
      sendAt: date
    });

    return sms.sid
}


module.exports = sendScheduledSms;