const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";

export async function generateBotReply(env, prompt, { model = "llama-3.1-8b-instant", systemPrompt, maxTokens = 400 } = {}) {
  if (!env.GROQ_API_KEY) throw new Error("GROQ_API_KEY manquant dans l'environnement");
  const res = await fetch(GROQ_API, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq generateBotReply a échoué (${res.status}): ${await res.text()}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}
