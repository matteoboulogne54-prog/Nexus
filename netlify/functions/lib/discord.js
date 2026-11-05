const DISCORD_API = "https://discord.com/api/v10";

function botHeaders() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error("DISCORD_BOT_TOKEN manquant dans l'environnement");
  return {
    Authorization: `Bot ${token}`,
    "Content-Type": "application/json",
  };
}

async function createTextChannel(guildId, name, { parentId, topic } = {}) {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
    method: "POST",
    headers: botHeaders(),
    body: JSON.stringify({ name, type: 0, parent_id: parentId, topic }),
  });
  if (!res.ok) {
    throw new Error(`Discord createTextChannel a échoué (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

async function createRole(guildId, { name, color, permissions = "0" }) {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
    method: "POST",
    headers: botHeaders(),
    body: JSON.stringify({ name, color, permissions }),
  });
  if (!res.ok) {
    throw new Error(`Discord createRole a échoué (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

async function notifyAgencyWebhook(content, { embeds } = {}) {
  const url = process.env.DISCORD_AGENCY_WEBHOOK_URL;
  if (!url) throw new Error("DISCORD_AGENCY_WEBHOOK_URL manquant dans l'environnement");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, embeds }),
  });
  if (!res.ok) {
    throw new Error(`Discord webhook a échoué (${res.status}): ${await res.text()}`);
  }
  return { ok: true };
}

module.exports = { createTextChannel, createRole, notifyAgencyWebhook };
