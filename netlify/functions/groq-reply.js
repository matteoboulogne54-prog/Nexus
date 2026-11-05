const { wrap } = require("./lib/http");
const groq = require("./lib/groq");

exports.handler = wrap(({ body }) => {
  const { prompt, model, systemPrompt, maxTokens } = body;
  return groq.generateBotReply(prompt, { model, systemPrompt, maxTokens });
});
