const { wrap } = require("./lib/http");
const discord = require("./lib/discord");

exports.handler = wrap(({ body }) => {
  const { content, embeds } = body;
  return discord.notifyAgencyWebhook(content, { embeds });
});
