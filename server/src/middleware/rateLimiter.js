// ponytail: in-memory fixed-window limiter — per-process only; swap for
// express-rate-limit + shared store if the app ever runs on multiple instances.
export const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 20, message = "Too many requests, please try again later" } = {}) => {
  const hits = new Map();

  setInterval(() => {
    const now = Date.now();
    hits.forEach((entry, key) => {
      if (entry.resetAt <= now) hits.delete(key);
    });
  }, windowMs).unref();

  return (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > max) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({ message });
    }
    return next();
  };
};
