require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const cancelSms = (smsId) => {
    client.messages(smsId)
        .update({status: 'canceled'})
        .then(message => console.log(message.to));
}

module.exports = cancelSms;