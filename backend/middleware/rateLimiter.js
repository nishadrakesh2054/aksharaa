const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 600,
  message = "Too many requests. Please try again later.",
} = {}) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    const current = hits.get(key);

    if (!current || current.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    if (current.count > max) {
      const retryAfter = Math.ceil((current.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({
        success: false,
        message,
      });
    }

    if (hits.size > 10000) {
      for (const [storedKey, value] of hits.entries()) {
        if (value.resetAt <= now) hits.delete(storedKey);
      }
    }

    return next();
  };
};

module.exports = createRateLimiter;
