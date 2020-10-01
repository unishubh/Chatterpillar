const data = require('../datastore.json');
const Response = require('./response');

const handleResponses = (parentObj, childPayloads) => {
  const buttons = [];
  childPayloads.forEach((child) => {
    const res = JSON.parse(data[child]);
    switch (res.type) {
      case 'postback':
        buttons.push(Response.genPostbackButton(child, res.title));
        break;
      default:
        console.log('unidentified type');
        break;
    }
  });
  const response = Response.genButtonTemplate(parentObj.text, buttons);
  return response;
};

module.exports = {
  handleResponses,
};
