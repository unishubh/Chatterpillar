const datastore = require('../datastore.json');

const text = (identifier) => {
  const ourResponse = { text: datastore[identifier].text };
  return ourResponse;
};

const quickReply = (identifier) => {
  const reply = datastore[identifier];
  const choices = [];
  const { options } = reply;
  console.log(reply);
  for (let i = 0; i < options.length; i += 1) {
    choices.push(datastore[options[i]]);
  }
  const ourResponse = {
    text: reply.text,
    quick_replies: choices,
  };
  return ourResponse;
};

module.exports = {
  text, quickReply,
};
