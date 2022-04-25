const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// const sendSms = require('./scheduled_sms');
const sendSms = require('./scheduled_sms2');
const sendSmsGroupe = require('./groupe_sms');
const cancelSms = require('./cancel_scheduled_sms');

// Express settings
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// Define PORT
const port = 3000;


// Create rappelsms endpoint
app.post('/rappelsms', async (req, res) => {
  const { crenauDate, crenauHeureDebut,crenauHeureFin, phone, nom, societe, urlMission } = req.body;
  const rappelCrenau = {
    crenauDate,
    crenauHeureDebut,
    crenauHeureFin,
    phone,
    nom,
    societe,
    urlMission
  };

  let rappelMessage = nom + ", n'oublie pas ta course aujourd'hui de " + crenauHeureDebut + "h à "+ crenauHeureFin + "h, pour " + societe + ".",
  url = `\n` + "voici la mission:" + `\n` + "localhost:4200/mission/" + urlMission
  if(urlMission != ""){
    rappelMessage += url;
  }

  // sendSms(rappelCrenau.crenauDate, rappelCrenau.phone, rappelMessage);
  const messageId = await sendSms(rappelCrenau.crenauDate, rappelCrenau.phone, rappelMessage);

  res.status(201).send({
    message: 'Envoie du sms programmé confirmée',
    smsId: messageId,
    data: (rappelCrenau)
  })
});

// Create notificationCrenau endpoint
app.post('/notificationCrenau', (req, res) => {
  const { role, date, phoneTab } = req.body;
  const message = role + ' viens de rajouter des créneaux pour le ' + date + '. Connectez-vous pour les réserver'
  
  sendSmsGroupe(phoneTab, message);

  res.status(201).send({
    message: 'Envoie du sms de groupe confirmée',
    data: (phoneTab)
  })
});


// annuler sms programmé
app.post('/cancelRappelSms', (req, res) => {
  const { messageId } = req.body;
  cancelSms(messageId);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
 
// module.exports = app;