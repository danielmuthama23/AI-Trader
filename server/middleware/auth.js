function authMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_SECRET_KEY;

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

module.exports = authMiddleware;
