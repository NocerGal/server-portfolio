const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 5000;
require('dotenv').config();

app.use(express.static('dist/'));
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

var myemail = process.env.MAIL;
var password = process.env.PASSWORD;

function sendEmail({ message, email, firstName, lastName }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: myemail,
        pass: password,
      },
    });

    const mail_config = {
      from: myemail,
      to: myemail,
      subject: 'Contact from Portfolio',
      text: `@ from : ${email}, name : ${firstName} ${lastName}, message : ${message}  `,
    };
    transporter.sendMail(mail_config, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ mese: 'Email sent succesfuly' });
    });
  });
}

app.get('/', (req, res) => {
  sendEmail()
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.post('/send_email', (req, res) => {
  sendEmail(req.body)
    .then((response) => {
      res.send(response.message);
      console.log(req.body);
    })
    .catch((error) => res.status(500).end(error.mesage));
});

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
  console.log(`${password}`);
});
