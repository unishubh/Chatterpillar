const GraphAPi = require('./graph-api');
const Handler = require('./replyHandler');

module.exports = class Receive {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  async handleMessage() {
    const handler = new Handler(this.user, this.webhookEvent);
    const responses = await handler.handleReply();

    if (Array.isArray(responses)) {
      let delay = 0;
      responses.forEach((response) => {
        this.sendMessage(response, delay * 2000);
        delay += 1;
      });
    } else {
      this.sendMessage(responses);
    }
  }

  sendMessage(response, delay = 0) {
    // Check if there is delay in the response
    if ('delay' in response) {
      // eslint-disable-next-line no-param-reassign
      delay = response.delay;
      delete response.delay;
    }

    // Construct the message body
    let requestBody = {
      recipient: {
        id: this.user.psid,
      },
      message: response,
    };

    // Check if there is persona id in the response
    if ('persona_id' in response) {
      const { personaId } = response;
      delete response.persona_id;

      requestBody = {
        recipient: {
          id: this.user.psid,
        },
        message: response,
        personaId,
      };
    }

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }
};
