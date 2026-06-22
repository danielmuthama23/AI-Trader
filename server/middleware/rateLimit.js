const redis = require('../db/redis');

async function rateLimitMiddleware(req, res, next) {
  const ip = req.ip;
  const key = `ratelimit:${ip}`;
  const limit = 100; // 100 requests per minute

  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 60);
    }

    if (count > limit) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    next();
  } catch (error) {
    console.warn('Rate limit check failed:', error);
    next(); // Allow on error
  }
}

module.exports = rateLimitMiddleware;
