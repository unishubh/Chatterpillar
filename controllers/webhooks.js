const config = require('../services/config');
const GraphAPi = require('../services/graph-api');
const i18n = require('../i18n.config');
const Receive = require('../services/receive');
// const Investcon = require('../services/investcon');
const { User, users } = require('../services/user');
const dbHandlerFetch = require('../mysql/dbHandlers/fetch');
const dbHandlerInser = require('../mysql/dbHandlers/insert');

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

// const sendReply = async (senderPSID, reply) => {
//   console.log(reply);
//   request(
//     {
//       uri: `${config.mPlatfom}/me/messages`,
//       qs: {
//         access_token: config.pageAccesToken,
//       },
//       method: 'POST',
//       json: {
//         recipient: {
//           id: senderPSID,
//         },
//         message: reply,
//       },
//     },
//     (error) => {
//       if (error) {
//         console.error('Unable to send message:', error);
//       }
//     },
//   );
// };

const webhookHandler = async (req, res) => {
  console.log('webhook');
  const { body } = req;

  if (body.object === 'page') {
    res.status(200).send('EVENT_RECEIVED');

    body.entry.forEach(async (entry) => {
      const webhookEvent = entry.messaging[0];
      if ('read' in webhookEvent) {
        console.log('Got a read event');
        return;
      }

      if ('delivery' in webhookEvent) {
        console.log('Got a delivery event');
        return;
      }

      const senderPsid = webhookEvent.sender.id;
      const userExists = await dbHandlerFetch.getUser(senderPsid);
      if (userExists === 0) {
        const user = new User(senderPsid);

        GraphAPi.getUserProfile(senderPsid)
          .then((userProfile) => {
            user.setProfile(userProfile);
          })

          .catch((error) => {
            // The profile is unavailable
            console.log('Profile is unavailable:', error);
          })
          .finally(async () => {
            // user.isMember = await Investcon.isMember(senderPsid);
            users[senderPsid] = user;
            i18n.setLocale(user.locale);
            console.log(
              'New Profile PSID:',
              senderPsid,
              'with locale:',
              i18n.getLocale(),
            );
            dbHandlerInser.insertUser(`${user.firstName} ${user.lastName}`, user.psid, user.email, user.phone, user.gender);
            users[senderPsid].presentCommand = webhookEvent;
            const receiveMessage = new Receive(users[senderPsid], webhookEvent);
            return receiveMessage.handleMessage();
          });
      } else {
        users[senderPsid] = userExists;
        const receiveMessage = new Receive(users[senderPsid], webhookEvent);
        receiveMessage.handleMessage();
      }
    });
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

module.exports = {
  webhookVerifier,
  webhookHandler,
};
