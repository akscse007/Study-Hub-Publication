import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { verifySmtpConnection } from "./utils/emailService.js";
import bookRoutes from "./routes/bookRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/admin/index.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import whatsappLeadRoutes from "./routes/whatsappLeadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const ADMIN_URL = process.env.ADMIN_URL || "http://localhost:5174";

app.use(
  cors({
    origin: [CLIENT_URL, ADMIN_URL]
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "study-hub-server" });
});

app.use("/api/books", bookRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/whatsapp-leads", whatsappLeadRoutes);
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
    await verifySmtpConnection();
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

startServer();
