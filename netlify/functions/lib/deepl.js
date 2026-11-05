async function translateText(text, targetLang, { sourceLang } = {}) {
  const apiKey = process.env.DEEPL_API_KEY;
  const apiUrl = process.env.DEEPL_API_URL || "https://api-free.deepl.com/v2/translate";
  if (!apiKey) throw new Error("DEEPL_API_KEY manquant dans l'environnement");

  const body = new URLSearchParams();
  body.append("text", text);
  body.append("target_lang", targetLang);
  if (sourceLang) body.append("source_lang", sourceLang);

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`DeepL translateText a échoué (${res.status}): ${await res.text()}`);
  }
  const json = await res.json();
  return json.translations[0]?.text ?? "";
}

module.exports = { translateText };
