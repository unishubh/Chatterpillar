const assignResponse = require('./assignResponse');

module.exports.classifyMessage = async (message) => {
  let ourReply;
  console.log(message);
  if (message.hasOwnProperty('quick_reply')) {
    // quick reply recieved
    const { payload } = message.quick_reply;
    ourReply = await assignResponse.assign(payload);
  } else {
    // other types of messages to be implemented
    ourReply = await assignResponse.assign('welcome');
  }
  return ourReply;
};
