const { wrap } = require("./lib/http");
const github = require("./lib/github");

exports.handler = wrap(({ body }) => {
  const { clientSlug, commandeId, description } = body;
  return github.createClientRepo({ clientSlug, commandeId, description });
});
