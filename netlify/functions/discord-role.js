const { wrap } = require("./lib/http");
const discord = require("./lib/discord");

exports.handler = wrap(({ body }) => {
  const { guildId, name, color, permissions } = body;
  return discord.createRole(guildId, { name, color, permissions });
});
