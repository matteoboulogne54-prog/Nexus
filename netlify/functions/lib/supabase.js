const { createClient } = require("@supabase/supabase-js");

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants dans l'environnement");
  return createClient(url, key);
}

async function insertRow(table, row) {
  const supabase = client();
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw new Error(`Supabase insertRow (${table}) a échoué: ${error.message}`);
  return data;
}

module.exports = { insertRow };
