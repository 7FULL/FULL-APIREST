// We start express
const express = require('express');
const bodyParser = require('body-parser');
const { MongoDB } = require('./BBDD/MongoDB');
const BBDD = new MongoDB()

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//Pin pon
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

//User Data
app.post('/api/user', (req, res) => {
  BBDD.getUserData(req.body.data).then((data) => {
    res.send(data);
  });
});

//Reset user Data
app.post('/api/user/restore', (req, res) => {
  BBDD.resetUserData(req.body.data);

  return "OK";
});

// Add contact
app.post('/api/contact/add', (req, res) => {
  BBDD.addContact(req.body.data).then((data) => {
    res.send(data);
  });
});

// Update objects
app.post('/api/objects/update', (req, res) => {
  BBDD.updateObjects(req.body.data).then(r => {});

  return "OK";
});

// Update coins
app.post('/api/coins/update', (req, res) => {
  BBDD.updateCoins(req.body.data).then(r => {});

  return "OK";
});