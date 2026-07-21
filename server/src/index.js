import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/admin/index.js";
import whatsappLeadRoutes from "./routes/whatsappLeadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import landingImageRoutes from "./routes/landingImageRoutes.js";
import { createRateLimiter } from "./middleware/rateLimiter.js";

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

if (!process.env.JWT_SECRET) {
  if (IS_PRODUCTION) {
    console.error("FATAL: JWT_SECRET is not set. Refusing to start in production with the built-in default secret.");
    process.exit(1);
  }
  console.warn("WARNING: JWT_SECRET is not set — using an insecure development default. Set it in server/.env.");
}

if (IS_PRODUCTION && !process.env.CLIENT_URL) {
  console.error(
    "FATAL: CLIENT_URL is not set. CORS would reject the deployed frontend. Set it to the deployed site URL (e.g. https://your-site.onrender.com)."
  );
  process.exit(1);
}

// Localhost fallbacks apply to local development only; production requires CLIENT_URL (checked above).
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const ADMIN_URL = process.env.ADMIN_URL || ""; // optional: extra CORS origin if the admin panel is hosted separately

app.set("trust proxy", 1); // correct client IPs for rate limiting behind Render/other proxies

app.use(
  cors({
    origin: [CLIENT_URL, ADMIN_URL].filter(Boolean)
  })
);

// Baseline HTTP security headers (API-only server; helmet not needed for this set).
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (IS_PRODUCTION) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

app.use(express.json({ limit: "200kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "study-hub-server" });
});

// Spam protection for unauthenticated write endpoints.
const publicFormLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 60 });

app.use("/api/books", bookRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/landing-images", landingImageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/whatsapp-leads", publicFormLimiter, whatsappLeadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

startServer();
