const { wrap } = require("./lib/http");
const imgur = require("./lib/imgur");

exports.handler = wrap(({ body }) => {
  const { base64Data, title, description } = body;
  return imgur.uploadImageBase64(base64Data, { title, description });
});
