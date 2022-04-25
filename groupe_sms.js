require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilio = require('twilio')(accountSid, authToken);
const service = twilio.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID);

const sendSmsGroupe = (numbers, message) => {
      const bindings = numbers.map(number => {
        return JSON.stringify({ binding_type: 'sms', address: number });
      });
      service.notifications
        .create({
              toBinding: bindings,
              body: message
        })
        .then(notification => {
            //   console.log(notification);
              console.log('sent!')
        })
        .catch(err => {
              console.error(err);
        });
}

module.exports = sendSmsGroupe;