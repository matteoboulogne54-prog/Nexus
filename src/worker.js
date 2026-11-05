import * as discord from "./services/discord.js";
import * as github from "./services/github.js";
import * as groq from "./services/groq.js";
import * as resend from "./services/resend.js";
import * as imgur from "./services/imgur.js";
import * as deepl from "./services/deepl.js";
import * as geoapify from "./services/geoapify.js";
import * as supabase from "./services/supabase.js";

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, x-nexus-key",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function ok(data) {
  return new Response(JSON.stringify({ ok: true, data }), { status: 200, headers: corsHeaders() });
}

function fail(status, message) {
  return new Response(JSON.stringify({ ok: false, error: message }), { status, headers: corsHeaders() });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    const key = request.headers.get("x-nexus-key");
    if (!env.NEXUS_INTERNAL_API_KEY || key !== env.NEXUS_INTERNAL_API_KEY) {
      return fail(401, "Clé interne invalide ou manquante");
    }

    const route = url.pathname.replace("/api/", "");
    const body = request.method !== "GET" ? await request.json().catch(() => ({})) : {};
    const params = Object.fromEntries(url.searchParams);

    try {
      switch (route) {
        case "discord/channel":
          return ok(await discord.createTextChannel(env, body.guildId, body.name, { parentId: body.parentId, topic: body.topic }));
        case "discord/role":
          return ok(await discord.createRole(env, body.guildId, { name: body.name, color: body.color, permissions: body.permissions }));
        case "discord/notify":
          return ok(await discord.notifyAgencyWebhook(env, body.content, { embeds: body.embeds }));

        case "github/repo":
          return ok(await github.createClientRepo(env, { clientSlug: body.clientSlug, commandeId: body.commandeId, description: body.description }));
        case "github/commits":
          if (!params.owner || !params.repo) throw new Error("Paramètres 'owner' et 'repo' requis");
          return ok(await github.listRecentCommits(env, params.owner, params.repo));

        case "groq/reply":
          return ok(await groq.generateBotReply(env, body.prompt, { model: body.model, systemPrompt: body.systemPrompt, maxTokens: body.maxTokens }));

        case "resend/email":
          return ok(await resend.sendTransactionalEmail(env, { to: body.to, subject: body.subject, html: body.html, text: body.text, attachments: body.attachments }));

        case "imgur/upload":
          return ok(await imgur.uploadImageBase64(env, body.base64Data, { title: body.title, description: body.description }));

        case "deepl/translate":
          return ok(await deepl.translateText(env, body.text, body.targetLang, { sourceLang: body.sourceLang }));

        case "geoapify/lookup":
          if (!params.ip) throw new Error("Paramètre 'ip' requis");
          return ok(await geoapify.lookupIp(env, params.ip));
        case "geoapify/check-access":
          return ok(await geoapify.isCountryAllowed(env, body.ip, body.allowedCountryCodes));

        case "supabase/insert":
          return ok(await supabase.insertRow(env, body.table, body.row));

        default:
          return fail(404, `Route inconnue: ${route}`);
      }
    } catch (err) {
      console.error(err);
      return fail(500, err.message);
    }
  },
};
