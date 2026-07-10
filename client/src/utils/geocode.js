// Forward geocoding via Nominatim (OpenStreetMap) — free, no API key, CORS-enabled.
// Callers must debounce: Nominatim's usage policy allows max 1 request/second.
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

const pickArea = (addr) =>
  addr.suburb || addr.neighbourhood || addr.town || addr.village || addr.city || addr.municipality || "";

const pickDistrict = (addr) => addr.state_district || addr.district || addr.county || addr.city_district || "";

export const searchPlaces = async (query, { signal } = {}) => {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    limit: "6",
    // ponytail: sellers are India-only today; drop this param to geocode worldwide
    countrycodes: "in"
  });
  const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    signal,
    headers: { Accept: "application/json" }
  });
  if (!res.ok) throw new Error("Location search failed. Please try again.");
  const data = await res.json();
  return data
    .map((item) => {
      const addr = item.address || {};
      return {
        displayName: item.display_name,
        shortName: item.name || String(item.display_name).split(",")[0],
        latitude: Number(item.lat),
        longitude: Number(item.lon),
        area: pickArea(addr),
        district: pickDistrict(addr)
      };
    })
    .filter((place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude));
};
