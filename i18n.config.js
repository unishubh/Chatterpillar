const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en_US', 'fr_FR', 'es_ES', 'es_LA', 'pt_BR', 'id_ID'],
  defaultLocale: 'en_US',
  directory: path.join(__dirname, 'constants'),
  objectNotation: true,
  api: {
    __: 'translate',
    __n: 'translateN',
  },
});

module.exports = i18n;
