const { wrap } = require("./lib/http");
const deepl = require("./lib/deepl");

exports.handler = wrap(({ body }) => {
  const { text, targetLang, sourceLang } = body;
  return deepl.translateText(text, targetLang, { sourceLang });
});
