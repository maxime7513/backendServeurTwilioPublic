const express = require('express');
const fetch = require('isomorphic-fetch');
const cors = require('cors');
const bodyParser = require('body-parser');

const sendSms = require('./send_sms');
const sendScheduledSms = require('./scheduled_sms');
const sendSmsGroupe = require('./groupe_sms');
const cancelSms = require('./cancel_scheduled_sms');
const sendMail = require('./send_mail');
const imagesUpload = require('./upload_img');

// const multer = require('multer');

// Express settings
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());

// Define PORT
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req,res) => res.send('express server run!!!'));

// rappelsms endpoint
app.post('/rappelsms', async (req, res) => {
  const { crenauDate, crenauHeureDebut,crenauHeureFin, phone, nom, societe, urlMission, typeMission } = req.body;
  const rappelCrenau = {
    crenauDate,
    phone
  };

  let rappelMessage;
  if(typeMission == 'astreinte'){
    rappelMessage = nom + ", n'oublie que tu est d'astreinte aujourd'hui de " + crenauHeureDebut + " à "+ crenauHeureFin + ", pour " + societe + ". Tu recevera un message si " + societe + " à besoin de toi.";
  }else{
    rappelMessage = nom + ", n'oublie pas ta course aujourd'hui de " + crenauHeureDebut + " à "+ crenauHeureFin + ", pour " + societe + ".",
    url = `\n` + "voici la mission:" + `\n` + "woozoo.delivery/missionRoseBaie/" + urlMission
    if(urlMission != ""){
      rappelMessage += url;
    }
  }

  const messageId = await sendScheduledSms(rappelCrenau.crenauDate, rappelCrenau.phone, rappelMessage);
  console.log('sms rappel => ' + typeMission + 'phone => ' + rappelCrenau.phone)
  res.status(201).send({
    message: 'Envoie du sms programmé confirmée',
    smsId: messageId,
    data: (rappelCrenau)
  })
});

// notification d'un creneau à tous les livreurs
app.post('/notificationCrenau', (req, res) => {
  const { typeMission, role, date, phoneTab } = req.body;
  let message;
  if(typeMission == 'astreinte'){
    message = role + ' viens d\'ajouté une astreinte pour le ' + date + '. Connectez-vous pour la réserver' + `\n` + 'https://www.woozoo.delivery'
  }else{
    message = role + ' viens d\'ajouté un créneau de livraison pour le ' + date + '. Connectez-vous pour le réserver' + `\n` + 'https://www.woozoo.delivery'
  }

  sendSmsGroupe(phoneTab, message);

  res.status(201).send({
    message: 'Envoie du sms de groupe confirmée',
    data: (phoneTab)
  })
});

// notifications qu'un creneau c'est libéré à tous les livreurs
app.post('/notificationCrenau2', (req, res) => {
  const { typeMission, role, date, phoneTab, heureDebut, heureFin } = req.body;
  let message;
  if(typeMission == 'astreinte'){
    message = 'Une astreinte pour ' + role + ' le ' + date + ' de ' + heureDebut + ' à ' + heureFin + ', viens de se libérer.'
  }else{
    message = 'Un créneau de livraison pour ' + role + ' le ' + date + ' de ' + heureDebut + ' à ' + heureFin + ', viens de se libérer.'
  }

  sendSmsGroupe(phoneTab, message);

  res.status(201).send({
    message: 'Envoie du sms de groupe confirmée',
    data: (phoneTab)
  })
});

// envoyer sms apelle du livreur d'astreinte
app.post('/callAstreinte', (req, res) => {
  const { nom, phone, role } = req.body;
  const message = nom + ', ' + role + ' à besoin de toi maintenant. Tu à 15 minutes pour te présenter au restaurant.'

  sendSms(phone, message);

  res.status(201).send({
    message: 'Envoie du sms confirmée',
    // data: (phoneTab)
  })
});

// envoyer sms apelle du livreur d'astreinte
app.post('/annulationCreneau', (req, res) => {
  const { typeMission, phone, role, date, heureDebut, heureFin } = req.body;
  const message = role + ' à annuler son ' + typeMission + 'que tu avais réservé le ' + date + 'de ' + heureDebut + ' à ' + heureFin + '.'

  sendSms(phone, message);

  res.status(201).send({
    message: 'Envoie du sms confirmée',
    // data: (phoneTab)
  })
});

// annuler sms programmé
app.post('/cancelRappelSms', (req, res) => {
  const { messageId } = req.body;
  cancelSms(messageId);
});

// send email
app.post('/sendMail' , (req, res) => {
  const {to, subject, html} = req.body;
  const logo = `<b><img src="cid:logoWoozoo" style="width: 90%; max-width: 300px; display: block; margin: 50px auto auto;"/></b>`;
  const mailData = {
    from: 'Woozoo',
    to: to,
    subject: subject,
    html: html + logo,
    attachments: [{
      filename: 'logo-woozoo.png',
      path: './assets/logo-woozoo.png',
      cid: 'logoWoozoo'
     }]
  };

  sendMail(mailData);
})

app.post('/sendMailRecaptcha' , (req, res) => {
  const {from, to, subject, html, tokenRecaptcha} = req.body;
  const logo = `<b><img src="cid:logoWoozoo" style="width: 90%; max-width: 300px; display: block; margin: 50px auto auto;"/></b>`;
  const mailData = {
    from: from,
    to: to,
    subject: subject,
    html: html + logo,
    attachments: [{
      filename: 'logo-woozoo.png',
      path: './assets/logo-woozoo.png',
      cid: 'logoWoozoo'
     }]
  };

  // Hitting POST request to the URL, Google will
  // respond with success or error scenario.
  const secret_key = process.env.RECAPTCHA_SECRET_KEY;
  const url =
  `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${tokenRecaptcha}`;
 
  // Making POST request to verify captcha
  fetch(url, {
    method: "post",
  })
    .then((response) => response.json())
    .then((google_response) => {
      if (google_response.success == true) {
        // if captcha is verified
        sendMail(mailData);
        return res.send({ response: "Successful" });
      } else {
        // if captcha is not verified
        return res.send({ response: "Failed" });
      }
    })
    .catch((error) => {
      // Some error while verify captcha
      return res.json({ error });
    });

})

// mail with multiple attachments endpoint
  // app.post('/uploadImage', imageUpload.single('image'), (req, res) => {
  //   console.log(req.file.path)
  //   res.send(req.file)
  // }, (error, req, res, next) => {
  //   res.status(400).send({ error: error.message })
  // })

app.post('/sendMailSubscription', (req, res) => {
  imagesUpload(req,res,function(err){
    if(err){
      console.log(err)
      return res.end("Something went wrong!");
    }else{
      const path = require('path'); // pour rennomer l'image
      const mailData = {
        from: 'contact@woozoo.io',
        to: 'contact@woozoo.io',
        subject: "Demande d'inscription livreur",
        html: req.body.html,
        attachments: [
          {
          // filename: req.file.filename, // "file" => envoie d'un seul fichier
          filename: "CI-Recto_" + req.body.nom + "_" + req.body.prenom + path.extname(req.files[0].filename),
          path: req.files[0].path,
         },
         {
          filename: "CI-Verso_" + req.body.nom + "_" + req.body.prenom + path.extname(req.files[1].filename),
          path: req.files[1].path,
         },
         {
          filename: "KBIS_" + req.body.nom + "_" + req.body.prenom + path.extname(req.files[2].filename),
          path: req.files[2].path,
         },
         {
          filename: "RIB_" + req.body.nom + "_" + req.body.prenom + path.extname(req.files[3].filename),
          path: req.files[3].path,
         },
        ]
      };
      sendMail(mailData);
    }
  })
})
