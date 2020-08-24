const assignResponse = require('./assignResponse');

module.exports.classifyMessage = async (message) => {
  let ourReply;
  console.log(message);
  if (message.hasOwnProperty('quick_reply')) {
    // quick reply recieved
    const { payload } = message.quick_reply;
    ourReply = await assignResponse.assign(payload);
  } else {
    // other event recieved, as of now dealing it with greeting
    ourReply = await assignResponse.assign('welcome');
  }
  return ourReply;
};
