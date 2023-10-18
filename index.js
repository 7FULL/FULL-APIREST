// We start express
const express = require('express');
const bodyParser = require('body-parser');
const MongoDBSingleton = require('./BBDD/MongoDB');
const BBDD = new MongoDBSingleton().getInstance();

const app = express();
const port = 1234;

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

//User Data
app.post('/api/user/restore', (req, res) => {
  BBDD.resetUserData(req.body.data);

  return "ok";
});

// Add contact
app.post('/api/contact', (req, res) => {
  BBDD.addContact(req.body.data).then((data) => {
    res.send(data);
  });
});