const DISCORD_API = "https://discord.com/api/v10";

function botHeaders(env) {
  if (!env.DISCORD_BOT_TOKEN) throw new Error("DISCORD_BOT_TOKEN manquant dans l'environnement");
  return { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`, "Content-Type": "application/json" };
}

export async function createTextChannel(env, guildId, name, { parentId, topic } = {}) {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
    method: "POST",
    headers: botHeaders(env),
    body: JSON.stringify({ name, type: 0, parent_id: parentId, topic }),
  });
  if (!res.ok) throw new Error(`Discord createTextChannel a échoué (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function createRole(env, guildId, { name, color, permissions = "0" }) {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
    method: "POST",
    headers: botHeaders(env),
    body: JSON.stringify({ name, color, permissions }),
  });
  if (!res.ok) throw new Error(`Discord createRole a échoué (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function notifyAgencyWebhook(env, content, { embeds } = {}) {
  if (!env.DISCORD_AGENCY_WEBHOOK_URL) throw new Error("DISCORD_AGENCY_WEBHOOK_URL manquant dans l'environnement");
  const res = await fetch(env.DISCORD_AGENCY_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, embeds }),
  });
  if (!res.ok) throw new Error(`Discord webhook a échoué (${res.status}): ${await res.text()}`);
  return { ok: true };
}
