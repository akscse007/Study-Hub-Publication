import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true, trim: true },
    entity: { type: String, trim: true },
    entityId: { type: String, trim: true },
    details: { type: String, trim: true },
    performedBy: { type: String, trim: true, default: "admin" }
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
