// Single source of truth for the API base URL. Import API_BASE_URL from here —
// never hardcode a URL or read import.meta.env elsewhere.
const configured = import.meta.env.VITE_API_BASE_URL;

if (!configured && import.meta.env.PROD) {
  // Fail loudly in production: a missing env var otherwise surfaces as silent fetch failures.
  console.error(
    "VITE_API_BASE_URL is not set. Set it in the deployment environment (e.g. https://your-api.onrender.com/api) — API requests will fail without it."
  );
}

// Localhost fallback is for local development only; production must set VITE_API_BASE_URL.
export const API_BASE_URL = configured || "http://localhost:5000/api";
