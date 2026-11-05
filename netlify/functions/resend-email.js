const { wrap } = require("./lib/http");
const resend = require("./lib/resend");

exports.handler = wrap(({ body }) => {
  const { to, subject, html, text, attachments } = body;
  return resend.sendTransactionalEmail({ to, subject, html, text, attachments });
});
