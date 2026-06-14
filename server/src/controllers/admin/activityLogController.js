import ActivityLog from "../../models/ActivityLog.js";

export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(200).lean();
    return res.status(200).json(logs);
  } catch (error) {
    return next(error);
  }
};
