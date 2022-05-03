const express = require('express');
const router = express.Router();
const { verify, sign } = require('jsonwebtoken');
const { User } = require('../models');

router.get('/', (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const user = User.findOne({ where: { refreshToken } });

  if (!user) {
    res.sendStatus(403);
  }

  verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.email !== decoded.email) res.sendStatus(403);
    const accessToken = sign({ email: decoded.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    res.json({ accessToken });
  });
});

module.exports = router;