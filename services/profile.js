// Imports dependencies
const GraphAPi = require('../helpers/graph-api');
const i18n = require('../i18n.config');
const config = require('../helpers/config');

const locales = i18n.getLocales();

module.exports = class Profile {
  setWebhook() {
    GraphAPi.callSubscriptionsAPI();
    GraphAPi.callSubscribedApps();
  }

  setThread() {
    const profilePayload = {
      ...this.getGetStarted(),
    };

    GraphAPi.callMessengerProfileAPI(profilePayload);
  }

  setPersonas() {
    const { newPersonas } = config;

    GraphAPi.getPersonaAPI()
      .then((personas) => {
        for (const persona of personas) {
          config.pushPersona({
            name: persona.name,
            id: persona.id,
          });
        }
        console.log(config.personas);
        return config.personas;
      })
      .then((existingPersonas) => {
        for (const persona of newPersonas) {
          if (!(persona.name in existingPersonas)) {
            GraphAPi.postPersonaAPI(persona.name, persona.picture)
              .then((personaId) => {
                config.pushPersona({
                  name: persona.name,
                  id: personaId,
                });
                console.log(config.personas);
              })
              .catch((error) => {
                console.log('Creation failed:', error);
              });
          } else {
            console.log('Persona already exists for name:', persona.name);
          }
        }
      })
      .catch((error) => {
        console.log('Creation failed:', error);
      });
  }

  setGetStarted() {
    const getStartedPayload = this.getGetStarted();
    GraphAPi.callMessengerProfileAPI(getStartedPayload);
  }

  setGreeting() {
    const greetingPayload = this.getGreeting();
    GraphAPi.callMessengerProfileAPI(greetingPayload);
  }

  setPersistentMenu() {
    const menuPayload = this.getPersistentMenu();
    GraphAPi.callMessengerProfileAPI(menuPayload);
  }

  setWhitelistedDomains() {
    const domainPayload = this.getWhitelistedDomains();
    GraphAPi.callMessengerProfileAPI(domainPayload);
  }

  getGetStarted() {
    return {
      get_started: {
        payload: 'GET_STARTED',
      },
    };
  }

  getGreeting() {
    const greetings = [];

    for (const locale of locales) {
      greetings.push(this.getGreetingText(locale));
    }

    return {
      greeting: greetings,
    };
  }

  getPersistentMenu() {
    const menuItems = [];

    for (const locale of locales) {
      menuItems.push(this.getMenuItems(locale));
    }

    return {
      persistent_menu: menuItems,
    };
  }

  getGreetingText(locale) {
    const param = locale === 'en_US' ? 'default' : locale;

    i18n.setLocale(locale);

    const localizedGreeting = {
      locale: param,
      text: i18n.__('profile.greeting', {
        user_first_name: '{{user_first_name}}',
      }),
    };

    console.log(localizedGreeting);
    return localizedGreeting;
  }

  getMenuItems(locale) {
    const param = locale === 'en_US' ? 'default' : locale;

    i18n.setLocale(locale);

    const localizedMenu = {
      locale: param,
      composer_input_disabled: false,
      call_to_actions: [
        {
          title: i18n.__('menu.support'),
          type: 'nested',
          call_to_actions: [
            {
              title: i18n.__('menu.order'),
              type: 'postback',
              payload: 'TRACK_ORDER',
            },
            {
              title: i18n.__('menu.help'),
              type: 'postback',
              payload: 'CARE_HELP',
            },
          ],
        },
        {
          title: i18n.__('menu.suggestion'),
          type: 'postback',
          payload: 'CURATION',
        },
        {
          type: 'web_url',
          title: i18n.__('menu.shop'),
          url: config.shopUrl,
          webview_height_ratio: 'full',
        },
      ],
    };

    console.log(localizedMenu);
    return localizedMenu;
  }

  getWhitelistedDomains() {
    const whitelistedDomains = {
      whitelisted_domains: config.whitelistedDomains,
    };

    console.log(whitelistedDomains);
    return whitelistedDomains;
  }
};
