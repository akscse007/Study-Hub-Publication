const ROLE_RANK = { subadmin: 1, superadmin: 2, developer: 3 };

export const requireRole = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (ROLE_RANK[req.user.role] < ROLE_RANK[minRole]) {
      return res.status(403).json({ message: "Forbidden: insufficient privileges" });
    }
    next();
  };
};

export const canManageRole = (targetRole) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const actorRank = ROLE_RANK[req.user.role];
    const targetRank = ROLE_RANK[targetRole];
    if (actorRank <= targetRank) {
      return res.status(403).json({ message: "Cannot manage equal or higher role" });
    }
    next();
  };
};

export const preventSelfElevate = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const bodyRole = req.body?.role?.toLowerCase();
  const paramsId = req.params.id;

  if (bodyRole && ROLE_RANK[bodyRole] > ROLE_RANK[req.user.role]) {
    return res.status(403).json({ message: "Cannot assign role higher than your own" });
  }

  if (paramsId && req.targetUser?.userId === req.user.userId && bodyRole && bodyRole !== req.user.role) {
    return res.status(403).json({ message: "Cannot change your own role" });
  }

  next();
};
