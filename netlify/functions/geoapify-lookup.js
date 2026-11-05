const { wrap } = require("./lib/http");
const geoapify = require("./lib/geoapify");

exports.handler = wrap(({ params }) => {
  if (!params.ip) throw new Error("Paramètre 'ip' requis");
  return geoapify.lookupIp(params.ip);
});
