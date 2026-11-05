const { wrap } = require("./lib/http");
const supabase = require("./lib/supabase");

exports.handler = wrap(({ body }) => {
  const { table, row } = body;
  return supabase.insertRow(table, row);
});
