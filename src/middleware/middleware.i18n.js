const { translate } = require('../config/configuration.i18n');

function i18nMiddleware(req, res, next) {
  const lang = req.headers['accept-language']?.split(',')[0]?.substring(0, 2) ||
               req.query.lang ||
               req.body.lang ||
               'fr';

  const supportedLangs = ['fr', 'wo', 'en'];
  req.lang = supportedLangs.includes(lang) ? lang : 'fr';

  req.t = translate(req);

  next();
}

module.exports = i18nMiddleware;
