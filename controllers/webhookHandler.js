const request = require('request');
const classifier = require('./classifier');
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

const sendReply = async (senderPSID, reply) => {
  console.log(reply);
  request(
    {
      uri: `${config.mPlatfom}/me/messages`,
      qs: {
        access_token: config.pageAccesToken,
      },
      method: 'POST',
      json: {
        recipient: {
          id: senderPSID,
        },
        message: reply,
      },
    },
    (error) => {
      if (error) {
        console.error('Unable to send message:', error);
      }
    },
  );
};

const webhookHandler = async (req, res) => {
  console.log('webhook');
  res.sendStatus(200);
  const { entry } = req.body;
  for (let i = 0; i < entry.length; i += 1) {
    const event = entry[i];
    const messageObject = event.messaging[0];
    if (messageObject.hasOwnProperty('message')) {
      const senderPSID = messageObject.sender.id;
      const ourReply = await classifier.classifyMessage(messageObject.message);
      sendReply(senderPSID, ourReply);
    } else {
      // others fields to be implemented
      console.log('Ack recieved');
    }
  }
};

module.exports = {
  webhookVerifier,
  webhookHandler,
};
