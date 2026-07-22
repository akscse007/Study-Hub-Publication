import "dotenv/config";

export const JWT_EXPIRES_IN = "7d";

export const JWT_SECRET = process.env.JWT_SECRET?.trim();

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Set JWT_SECRET in the server environment before starting the API.");
}
