const GEOAPIFY_IP_API = "https://api.geoapify.com/v1/ipinfo";

async function lookupIp(ip) {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) throw new Error("GEOAPIFY_API_KEY manquant dans l'environnement");

  const url = `${GEOAPIFY_IP_API}?ip=${encodeURIComponent(ip)}&apiKey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geoapify lookupIp a échoué (${res.status}): ${await res.text()}`);
  }
  const json = await res.json();
  return {
    country: json.country?.name,
    countryCode: json.country?.iso_code,
    city: json.city?.name,
    lat: json.location?.latitude,
    lon: json.location?.longitude,
  };
}

async function isCountryAllowed(ip, allowedCountryCodes = []) {
  if (!allowedCountryCodes.length) return true;
  const info = await lookupIp(ip);
  return allowedCountryCodes.includes(info.countryCode);
}

module.exports = { lookupIp, isCountryAllowed };
