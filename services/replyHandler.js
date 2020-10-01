const data = require('../datastore.json');
const handleResponses = require('./handleResponses');

module.exports = class ReplyHandler {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handleReply() {
    const event = this.webhookEvent;
    const { payload } = event.message;
    const replyObj = JSON.parse(data[payload]);
    const responses = replyObj.child;
    const sendRes = handleResponses(replyObj, responses);
    return sendRes;
  }
};
