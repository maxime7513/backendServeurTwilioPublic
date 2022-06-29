require('dotenv').config();
const userGmail = process.env.USER_GMAIL;
const passGmail = process.env.PASS_GMAIL;

const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: userGmail,
            pass: passGmail,
         },
    secure: true,
});


const sendMail = (mailData) => {
    transporter.sendMail(mailData, (error, info) => {
        if(error){
            return console.log('error')
        }
        res.status(200).send({ message: "Mail send", message_id: info.messageId});
    })
}

module.exports = sendMail;