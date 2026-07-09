import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

const JWT_SECRET = process.env.JWT_SECRET || "studyhub_jwt_secret_change_in_production";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await AdminUser.findOne({ userId: decoded.userId }).lean();
    if (!user || user.status !== "active") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = { userId: user.userId, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
