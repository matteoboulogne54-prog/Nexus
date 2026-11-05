const GEOAPIFY_IP_API = "https://api.geoapify.com/v1/ipinfo";

export async function lookupIp(env, ip) {
  if (!env.GEOAPIFY_API_KEY) throw new Error("GEOAPIFY_API_KEY manquant dans l'environnement");
  const url = `${GEOAPIFY_IP_API}?ip=${encodeURIComponent(ip)}&apiKey=${env.GEOAPIFY_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geoapify lookupIp a échoué (${res.status}): ${await res.text()}`);
  const json = await res.json();
  return {
    country: json.country?.name,
    countryCode: json.country?.iso_code,
    city: json.city?.name,
    lat: json.location?.latitude,
    lon: json.location?.longitude,
  };
}

export async function isCountryAllowed(env, ip, allowedCountryCodes = []) {
  if (!allowedCountryCodes.length) return true;
  const info = await lookupIp(env, ip);
  return allowedCountryCodes.includes(info.countryCode);
}
