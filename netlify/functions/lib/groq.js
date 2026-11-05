const Groq = require("groq-sdk");

function client() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY manquant dans l'environnement");
  return new Groq({ apiKey });
}

async function generateBotReply(prompt, { model = "llama-3.1-8b-instant", systemPrompt, maxTokens = 400 } = {}) {
  const groq = client();
  try {
    const completion = await groq.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: prompt },
      ],
    });
    return completion.choices[0]?.message?.content ?? "";
  } catch (err) {
    throw new Error(`Groq generateBotReply a échoué: ${err.message}`);
  }
}

module.exports = { generateBotReply };
