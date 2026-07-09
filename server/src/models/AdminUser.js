import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["developer", "superadmin", "subadmin"],
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    createdBy: { type: String, trim: true, default: "system" },
    lastLogin: { type: Date }
  },
  { timestamps: true }
);

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

export default AdminUser;
