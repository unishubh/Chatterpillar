const express = require('express');
const { urlencoded, json } = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');

const config = require('./services/config');
const webhooks = require('./controllers/webhooks');
const profile = require('./controllers/profile');

const app = express();

// Parse application/x-www-form-urlencoded
app.use(
  urlencoded({
    extended: true,
  }),
);

app.use(cors());

app.use(json({
  verify: (req, res, buf) => {
    const signature = req.headers['x-hub-signature'];

    if (!signature) {
      console.log("Couldn't validate the signature.");
    } else {
      const elements = signature.split('=');
      const signatureHash = elements[1];
      const expectedHash = crypto
        .createHmac('sha1', config.appSecret)
        .update(buf)
        .digest('hex');
      if (signatureHash !== expectedHash) {
        throw new Error("Couldn't validate the request signature.");
      }
    }
  },
}));
app.use(express.static(path.join(path.resolve(), 'public')));
app.set('view engine', 'ejs');
app.get('/', (_req, res) => {
  res.render('index');
});

// Add the apis
app.post('/test', (req, res) => {
  console.log('Testing');
  res.status(200).send('Recieved');
});

app.get('/webhook', webhooks.webhookVerifier);
app.post('/webhook', webhooks.webhookHandler);
app.get('/profile', profile.profile);

// Check if all environment variables are set
config.checkEnvVariables();

// listen for requests :)
const listener = app.listen(config.port, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);

  if (Object.keys(config.personas).length === 0 && config.appUrl && config.verifyToken) {
    console.log(
      `${'Is this the first time running?\n'
      + 'Make sure to set the both the Messenger profile, persona '
      + 'and webhook by visiting:\n'}${
        config.appUrl
      }/profile?mode=all&verify_token=${
        config.verifyToken}`,
    );
  }

  if (config.pageId) {
    console.log('Test your app by messaging:');
    console.log(`https://m.me/${config.pageId}`);
  }
});

// const express = require('express');
// const { urlencoded, json } = require('body-parser');
// const crypto = require('crypto');
// const cors = require('cors');
// const path = require('path');
// const config = require('./helpers/config');
// const webhookHandler = require('./controllers/webhookHandler');
// const profile = require('./controllers/profile');

// const app = express();

// app.get('/webhook', webhookHandler.webhookVerifier);
// app.post('/webhook', webhookHandler.webhookHandler);
// app.get('/profile', profile.profile);

// app.use(
//   urlencoded({
//     extended: true,
//   }),
//   cors(),
//   json({
//     verify: (req, res, buf) => {
//       const signature = req.headers['x-hub-signature'];
//       if (!signature) {
//         console.log("Couldn't validate the signature.");
//       } else {
//         const elements = signature.split('=');
//         const signatureHash = elements[1];
//         const expectedHash = crypto
//           .createHmac('sha1', config.appSecret)
//           .update(buf)
//           .digest('hex');
//         if (signatureHash !== expectedHash) {
//           throw new Error("Couldn't validate the request signature.");
//         }
//       }
//     },
//   }), express.static(path.join(path.resolve(), 'public')),
// );
// app.set('view engine', 'ejs');

// // listen for requests :)
// const listener = app.listen(config.port, () => {
//   console.log(`Your app is listening on port ${listener.address().port}`);

//   if (Object.keys(config.personas).length === 0 && config.appUrl && config.verifyToken) {
//     console.log(
//       `${'Is this the first time running?\n'
// eslint-disable-next-line max-len
//       + 'Make sure to set the both the Messenger profile, persona and webhook by visiting:\n'}${config.appUrl}/profile?mode=all&verify_token=${config.verifyToken}`,
//     );
//   }

//   if (config.pageId) {
//     console.log('Test your app by messaging:');
//     console.log(`https://m.me/${config.pageId}`);
//   }
// });
