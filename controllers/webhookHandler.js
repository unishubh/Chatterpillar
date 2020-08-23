const request = require('request');
const config = require('../helpers/config');

const webhookVerifier = async (req, res) => {
  console.log(req.query);

  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token && mode === 'subscribe' && token === config.verifyToken) {
    // Responds with the challenge token from the request
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
};

const webhookHandler = async (req, res) => {
  console.log('webhook');
  console.log(req);
  res.status(200).send('EVENT_RECEIVED');
  request(
    {
      uri: `${config.mPlatfom}/me/messages`,
      qs: {
        access_token: config.pageAccesToken,
      },
      method: 'POST',
      json: {
        recipient: {
          id: this.user.psid,
        },
        message: {
          text: 'Hello, event recieved',
        },
      },
    },
    (error) => {
      if (error) {
        console.error('Unable to send message:', error);
      }
    },
  );
};

module.exports = {
  webhookVerifier,
  webhookHandler,
};
