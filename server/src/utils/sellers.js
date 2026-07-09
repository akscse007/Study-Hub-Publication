import Seller from "../models/Seller.js";
import { asString } from "./sanitize.js";

const parseCoord = (value, min, max) => {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const num = Number(value);
  return Number.isFinite(num) && num >= min && num <= max ? num : null;
};

// Extracts a validated { lat, lng } pair from query params, or null when absent/malformed.
export const parseSearchCoords = (query = {}) => {
  const lat = parseCoord(query.lat, -90, 90);
  const lng = parseCoord(query.lng, -180, 180);
  return lat !== null && lng !== null ? { lat, lng } : null;
};

// Whitelists and validates a seller create/update payload. Returns { data } or { error }.
export const parseSellerPayload = (body = {}) => {
  const distributorName = asString(body.distributorName, 120).trim();
  const contactNumber = asString(body.contactNumber, 20).trim();
  const area = asString(body.area, 120).trim();
  const district = asString(body.district, 120).trim();
  const locationName = asString(body.locationName, 250).trim();
  const lat = parseCoord(body.latitude, -90, 90);
  const lng = parseCoord(body.longitude, -180, 180);

  if (!distributorName) return { error: "Distributor name is required" };
  if (!/^\+?[\d\s()-]{6,20}$/.test(contactNumber)) return { error: "A valid contact number is required" };
  if (!locationName) return { error: "Location is required" };
  if (lat === null || lng === null) return { error: "A valid latitude and longitude are required" };

  return {
    data: {
      distributorName,
      contactNumber,
      area,
      district,
      locationName,
      location: { type: "Point", coordinates: [lng, lat] }
    }
  };
};

// Sellers ordered by geographic proximity when coords are given (2dsphere $geoNear),
// otherwise in stable creation order so serial numbers stay consistent.
export const listSellers = (coords) => {
  if (!coords) return Seller.find().sort({ createdAt: 1 }).lean();
  return Seller.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [coords.lng, coords.lat] },
        distanceField: "distanceMeters",
        spherical: true
      }
    },
    { $addFields: { distanceKm: { $round: [{ $divide: ["$distanceMeters", 1000] }, 1] } } },
    { $project: { distanceMeters: 0 } }
  ]);
};
