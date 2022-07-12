require('dotenv').config();
const userMail = process.env.USER_MAIL;
const passMail = process.env.PASS_MAIL;

const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: "ssl0.ovh.net",
       auth: {
            user: userMail,
            pass: passMail,
         },
    secure: true,
});


const sendMail = (mailData) => {
    transporter.sendMail(mailData, (error, info) => {
        if(error){
            return console.log('error')
        }
        console.log('email send')
        res.status(200).send({ message: "Mail send", message_id: info.messageId});
    })
}

module.exports = sendMail;