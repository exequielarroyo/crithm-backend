const { verify } = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  const accessToken = req.header('accessToken');

  if (!accessToken) {
    res.json({ error: 'user not logged in' });
  } else {
    try {
      const validToken = verify(accessToken, 'secret123');
      req.user = validToken
      if (validToken) {
        return next();
      }
    } catch (err) {
      res.json({ error: err.message });
    }
  }
};

module.exports = { validateToken };