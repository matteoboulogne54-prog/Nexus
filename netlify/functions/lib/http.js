function checkInternalKey(event) {
  const key = event.headers["x-nexus-key"] || event.headers["X-Nexus-Key"];
  if (!process.env.NEXUS_INTERNAL_API_KEY || key !== process.env.NEXUS_INTERNAL_API_KEY) {
    return false;
  }
  return true;
}

function ok(data) {
  return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true, data }) };
}

function fail(status, message) {
  return { statusCode: status, headers: cors(), body: JSON.stringify({ ok: false, error: message }) };
}

function cors() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, x-nexus-key",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function wrap(fn) {
  return async (event) => {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 204, headers: cors(), body: "" };
    }
    if (!checkInternalKey(event)) {
      return fail(401, "Clé interne invalide ou manquante");
    }
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      const data = await fn({ body, params: event.queryStringParameters || {}, path: event.path });
      return ok(data);
    } catch (err) {
      console.error(err);
      return fail(500, err.message);
    }
  };
}

module.exports = { wrap, ok, fail };
