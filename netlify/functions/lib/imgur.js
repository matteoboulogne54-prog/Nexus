const IMGUR_API = "https://api.imgur.com/3";

async function uploadImageBase64(base64Data, { title, description } = {}) {
  const clientId = process.env.IMGUR_CLIENT_ID;
  if (!clientId) throw new Error("IMGUR_CLIENT_ID manquant dans l'environnement");

  const res = await fetch(`${IMGUR_API}/image`, {
    method: "POST",
    headers: { Authorization: `Client-ID ${clientId}`, "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Data, type: "base64", title, description }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(`Imgur uploadImageBase64 a échoué: ${JSON.stringify(json.data)}`);
  }
  return { url: json.data.link, deleteHash: json.data.deletehash, id: json.data.id };
}

module.exports = { uploadImageBase64 };
