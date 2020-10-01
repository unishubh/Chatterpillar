// const i18n = require('../i18n.config');
// const utils = require('../utils/utils');

module.exports = class Response {
  static genQuickReply(text, quickReplies) {
    const response = {
      text,
      quick_replies: [],
    };
    quickReplies.forEach((quickReply) => {
      response.quick_replies.push({
        content_type: 'text',
        title: quickReply.title,
        payload: quickReply.payload,
      });
    });

    return response;
  }

  static genGenericTemplate(imageUrl, title, subtitle, buttons) {
    const response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title,
              subtitle,
              imageUrl,
              buttons,
            },
          ],
        },
      },
    };

    return response;
  }

  static genImageTemplate(imageUrl, title, subtitle = '') {
    const response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title,
              subtitle,
              imageUrl,
            },
          ],
        },
      },
    };

    return response;
  }

  static genButtonTemplate(title, buttons) {
    const response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: title,
          buttons,
        },
      },
    };

    return response;
  }

  static genText(text) {
    const response = {
      text,
    };

    return response;
  }

  static genTextWithPersona(text, personaId) {
    const response = {
      text,
      personaId,
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    const response = {
      type: 'postback',
      title,
      payload,
    };

    return response;
  }

  static genWebUrlButton(title, url) {
    const response = {
      type: 'web_url',
      title,
      url,
    };

    return response;
  }

  static genWebUrlButtonExtension(title, url) {
    const response = {
      type: 'web_url',
      title,
      url,
      messenger_extensions: true,
    };

    return response;
  }

  static genPhoneButton(title, phoneNumber) {
    const response = {
      type: 'phone_number',
      title,
      payload: phoneNumber,
    };
    return response;
  }

  //   static async genNuxMessage(user) {
  //     const welcome = this.genText(
  //       i18n.__('get_started.welcome', {
  //         userFirstName: user.firstName,
  //         greetings: await utils.getGreetings(),
  //       }),
  //     );

  //     intro = this.genText(i18n.__('get_started.intro', {
  //       botName: 'MoneyBhai',
  //     }));

  //     isInvestor = this.genButtonTemplate(i18n.__('get_started.question'), [
  //       Response.genPostbackButton(
  //         'Already an investor',
  //         'OLD',
  //       ),
  //       Response.genPostbackButton(
  //         'New to investment',
  //         'NEW',
  //       ),
  //     ]);
  //     nuxMessages = [welcome, intro, isInvestor];

//     return nuxMessages;
//   }
};
