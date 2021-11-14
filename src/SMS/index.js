const express = require('express');
const cors = require('cors');

// twilio requirements
const accountSid = 'ACcd07c8f62452e67f934faa90156ca385';
const authToken = 'f0a5dc03881b267005f51482f452adf0';
const phoneNum = '+13344633456';

const client = require('twilio')(accountSid, authToken);

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send("Welcome to the Express Server");
});

// http://localhost:4000

app.get('/set-sms', (req, res) => {
  const {recipient, text} = req.query;
  client.messages.create({
    body: text,
    to: recipient,
    from: phoneNum,
  }).then(() => {
    res.send(JSON.stringify({ success: true }));
  })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

app.listen(4000, () =>
  console.log('Express server is running on localhost:4000')
);





