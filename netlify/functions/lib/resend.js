const { Resend } = require("resend");

function client() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY manquant dans l'environnement");
  return new Resend(apiKey);
}

async function sendTransactionalEmail({ to, subject, html, text, attachments }) {
  const resend = client();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("RESEND_FROM_EMAIL manquant dans l'environnement");

  const { data, error } = await resend.emails.send({ from, to, subject, html, text, attachments });
  if (error) throw new Error(`Resend sendTransactionalEmail a échoué: ${error.message}`);
  return data;
}

module.exports = { sendTransactionalEmail };
