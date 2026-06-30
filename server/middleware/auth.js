const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Bearer JWT verification middleware.
 * Reads the Authorization header, verifies the token, loads the user, and
 * attaches it to req.user. Responds 401 on any failure.
 */
async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const token = header.slice(7).trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    req.user = user;
    req.token = token;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = auth;
