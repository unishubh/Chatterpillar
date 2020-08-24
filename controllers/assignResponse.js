const buildResponse = require('./buildResponse');
const datastore = require('../datastore.json');

const assign = async (identifier) => {
  let ourReply;
  console.log(identifier);
  const reply = datastore[identifier];
  console.log(reply);
  const { type } = reply;
  if (type === 'text') {
    ourReply = await buildResponse.text(identifier);
  } else if (type === 'quick_reply') {
    ourReply = await buildResponse.quickReply(identifier);
  } else {
    // support for more types of responses to be added
  }
  return ourReply;
};

module.exports = {
  assign,
};
