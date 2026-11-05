const { wrap } = require("./lib/http");
const geoapify = require("./lib/geoapify");

exports.handler = wrap(({ body }) => {
  const { ip, allowedCountryCodes } = body;
  return geoapify.isCountryAllowed(ip, allowedCountryCodes);
});
