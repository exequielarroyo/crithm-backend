const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/Auth');
const asyncHandler = require('express-async-handler');

router.get('/', validateToken, async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(400);
      throw new Error('User does not exist');
    }

    await bcrypt.compare(password, user.password).then((similar) => {
      if (similar) {
        const accessToken = sign({ username: user.email, id: user.id }, process.env.JWT_SECRET);
        res.json({ token: accessToken, email: user.email, id: user.id });
      } else {
        res.json({ error: 'Wrong password' });
      }
    });
  }),
);

router.post('/register', async (req, res) => {
  const user = req.body;

  bcrypt.hash(user.password, 10).then(async (hashed) => {
    await User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      company: user.company,
      number: user.number,
      address: user.address,
      occupation: user.occupation,
      email: user.email,
      password: hashed,
    });
  });

  res.json('registered');
});

module.exports = router;
