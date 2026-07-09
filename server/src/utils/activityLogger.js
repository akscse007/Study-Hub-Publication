import ActivityLog from "../models/ActivityLog.js";

export const logActivity = async (action, entity, entityId, details, performedBy = "admin") => {
  try {
    await ActivityLog.create({ action, entity, entityId, details, performedBy });
  } catch (error) {
    console.error("Failed to log activity:", error.message);
  }
};
