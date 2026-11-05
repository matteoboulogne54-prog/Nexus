const RESEND_API = "https://api.resend.com/emails";

export async function sendTransactionalEmail(env, { to, subject, html, text, attachments }) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY manquant dans l'environnement");
  if (!env.RESEND_FROM_EMAIL) throw new Error("RESEND_FROM_EMAIL manquant dans l'environnement");
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to, subject, html, text, attachments }),
  });
  if (!res.ok) throw new Error(`Resend sendTransactionalEmail a échoué (${res.status}): ${await res.text()}`);
  return res.json();
}
