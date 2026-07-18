import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import AdminUser from "../models/AdminUser.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    const existing = await AdminUser.findOne({ userId: "dev753" });
    if (!existing) {
      const passwordHash = await bcrypt.hash("Dev#951@", 10);
      await AdminUser.create({
        userId: "dev753",
        passwordHash,
        role: "developer",
        status: "active",
        createdBy: "system"
      });
      console.log("Developer account created: dev753 / Dev#951@");
    } else {
      console.log("Developer account already exists");
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
