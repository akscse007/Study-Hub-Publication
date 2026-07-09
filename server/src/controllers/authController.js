import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";
import ActivityLog from "../models/ActivityLog.js";

const JWT_SECRET = process.env.JWT_SECRET || "studyhub_jwt_secret_change_in_production";
const JWT_EXPIRES_IN = "7d";

const logActivity = async (action, details) => {
  try {
    await ActivityLog.create({ action, entity: "AdminUser", details });
  } catch (error) {
    console.error("Failed to log auth activity:", error.message);
  }
};

export const login = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password || typeof userId !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "User ID and password are required" });
    }
    if (userId.length > 100 || password.length > 200) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await AdminUser.findOne({ userId: userId.toLowerCase() });
    if (!user) {
      await logActivity("Failed login attempt", `User ID: ${userId} — not found`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "active") {
      await logActivity("Failed login attempt", `User ID: ${userId} — inactive account`);
      return res.status(401).json({ message: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await logActivity("Failed login attempt", `User ID: ${userId} — wrong password`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user.userId, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    await logActivity("Login", `User ID: ${user.userId}, Role: ${user.role}`);

    return res.status(200).json({
      token,
      user: {
        userId: user.userId,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await logActivity("Logout", `User ID: ${req.user.userId}`);
    }
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    return next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await AdminUser.findOne({ userId: req.user.userId }).select("-passwordHash").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};
