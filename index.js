const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const sendSms = require('./send_sms');
const sendScheduledSms = require('./scheduled_sms');
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
const port = process.env.PORT || 3000;

app.get('/', (req,res) => res.send('express server run'));

// Create rappelsms endpoint
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
  console.log('sms rappel => ' + typeMission)
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
    message = role + ' viens d\'ajouté une astreinte pour le ' + date + '. Connectez-vous pour la réserver' + `\n` + 'www.woozoo.delivery'
  }else{
    message = role + ' viens d\'ajouté un créneau de livraison pour le ' + date + '. Connectez-vous pour le réserver' + `\n` + 'www.woozoo.delivery'
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
 
// module.exports = app;