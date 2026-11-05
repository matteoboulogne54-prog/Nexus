export async function insertRow(env, table, row) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants dans l'environnement");
  }
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase insertRow (${table}) a échoué (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}
