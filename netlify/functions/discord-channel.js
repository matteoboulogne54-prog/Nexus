const { wrap } = require("./lib/http");
const discord = require("./lib/discord");

exports.handler = wrap(({ body }) => {
  const { guildId, name, parentId, topic } = body;
  return discord.createTextChannel(guildId, name, { parentId, topic });
});
