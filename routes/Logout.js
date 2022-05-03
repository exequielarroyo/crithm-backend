const express = require('express');
const router = express.Router();
const { verify, sign } = require('jsonwebtoken');
const { User } = require('../models');

router.get('/', async (req, res) => {
  // on client, also delete the accessToken

  const cookies = req.cookies;

  if (!cookies.jwt) res.sendStatus(204);
  else {
    console.log(cookies.jwt);
  }
  const refreshToken = cookies.jwt;

  const user = await User.findOne({ where: { refreshToken } });

  if (!user) {
    res.clearCookie('jwt', { httpOnly: true });
    res.sendStatus(204);
  }

  User.update({ ...user, refreshToken: null }, { where: { email: user.email } });
  res.clearCookie('jwt', { httpOnly: true }); // secure: true - only serves on https
  res.sendStatus(204);
});

module.exports = router;
