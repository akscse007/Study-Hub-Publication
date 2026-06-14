import bcrypt from "bcryptjs";
import AdminUser from "../../models/AdminUser.js";
import { logActivity } from "../../utils/activityLogger.js";

const ROLE_RANK = { subadmin: 1, superadmin: 2, developer: 3 };

const isValidUserId = (id) => /^[a-z0-9_]{4,30}$/.test(id);

export const getAdminUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const query = {};
    if (search) {
      query.userId = { $regex: search, $options: "i" };
    }
    if (role) query.role = role;

    const users = await AdminUser.find(query).select("-passwordHash").sort({ createdAt: -1 }).lean();
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

export const createAdminUser = async (req, res, next) => {
  try {
    const { userId, password, role, status } = req.body;
    const actorRole = req.user.role;

    if (!userId || !password || !role) {
      return res.status(400).json({ message: "User ID, password, and role are required" });
    }

    if (!isValidUserId(userId)) {
      return res.status(400).json({ message: "User ID must be 4-30 lowercase alphanumeric or underscore characters" });
    }

    const targetRole = role.toLowerCase();
    if (!ROLE_RANK[targetRole]) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (ROLE_RANK[actorRole] <= ROLE_RANK[targetRole]) {
      return res.status(403).json({ message: "Cannot create user with equal or higher role" });
    }

    const existing = await AdminUser.findOne({ userId: userId.toLowerCase() }).lean();
    if (existing) return res.status(409).json({ message: "User ID already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await AdminUser.create({
      userId: userId.toLowerCase(),
      passwordHash,
      role: targetRole,
      status: status || "active",
      createdBy: req.user.userId
    });

    await logActivity("Create User", "AdminUser", user._id.toString(), `Created ${targetRole} ${user.userId} by ${req.user.userId}`);

    return res.status(201).json({
      _id: user._id,
      userId: user.userId,
      role: user.role,
      status: user.status,
      createdBy: user.createdBy,
      createdAt: user.createdAt
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, role, status } = req.body;
    const actorRole = req.user.role;

    const target = await AdminUser.findById(id).lean();
    if (!target) return res.status(404).json({ message: "User not found" });

    if (ROLE_RANK[actorRole] <= ROLE_RANK[target.role]) {
      return res.status(403).json({ message: "Cannot modify equal or higher role" });
    }

    if (target.userId === req.user.userId && role && role.toLowerCase() !== target.role) {
      return res.status(403).json({ message: "Cannot change your own role" });
    }

    const update = {};
    if (password) update.passwordHash = await bcrypt.hash(password, 10);
    if (role) {
      const newRole = role.toLowerCase();
      if (ROLE_RANK[actorRole] <= ROLE_RANK[newRole]) {
        return res.status(403).json({ message: "Cannot assign equal or higher role" });
      }
      update.role = newRole;
    }
    if (status) update.status = status;

    const user = await AdminUser.findByIdAndUpdate(id, update, { new: true }).select("-passwordHash").lean();

    await logActivity("Edit User", "AdminUser", user._id.toString(), `Updated ${user.userId} by ${req.user.userId}`);

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actorRole = req.user.role;

    const target = await AdminUser.findById(id).lean();
    if (!target) return res.status(404).json({ message: "User not found" });

    if (ROLE_RANK[actorRole] <= ROLE_RANK[target.role]) {
      return res.status(403).json({ message: "Cannot delete equal or higher role" });
    }

    if (target.userId === req.user.userId) {
      return res.status(403).json({ message: "Cannot delete your own account" });
    }

    await AdminUser.findByIdAndDelete(id);
    await logActivity("Delete User", "AdminUser", target._id.toString(), `Deleted ${target.userId} by ${req.user.userId}`);

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return next(error);
  }
};

export const toggleAdminUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actorRole = req.user.role;

    const target = await AdminUser.findById(id).lean();
    if (!target) return res.status(404).json({ message: "User not found" });

    if (ROLE_RANK[actorRole] <= ROLE_RANK[target.role]) {
      return res.status(403).json({ message: "Cannot modify equal or higher role" });
    }

    if (target.userId === req.user.userId) {
      return res.status(403).json({ message: "Cannot deactivate your own account" });
    }

    const newStatus = target.status === "active" ? "inactive" : "active";
    const user = await AdminUser.findByIdAndUpdate(id, { status: newStatus }, { new: true }).select("-passwordHash").lean();

    await logActivity("Role/Status Change", "AdminUser", user._id.toString(), `Status ${newStatus} for ${user.userId} by ${req.user.userId}`);

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};
