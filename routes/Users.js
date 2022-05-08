const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken, validateRole } = require('../middlewares/Auth');
const asyncHandler = require('express-async-handler');
const passport = require('passport');

router.get('/', validateToken, validateRole([1]), async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.json({ error: 'email is not registered' });
      // res.status(400);
      // throw new Error('User does not exist');
    }

    await bcrypt.compare(password, user.password).then((match) => {
      if (match) {
        const accessToken = sign({ email: user.email, role: user.roles }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
        const refreshToken = sign({ email: user.email, role: user.roles }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        User.update({ ...user, refreshToken }, { where: { email: user.email } });

        // for using thunder
        // res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        // for react
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ role: user.role, accessToken });
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
      role: user.role,
      password: hashed,
    });
  });

  res.json('registered');
});

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/auth/user', failureRedirect: '/error' }));

router.get('/user', isLoggedIn, (req, res) => {
  res.send('Logged in');
});
router.get('/error', (req, res) => {
  res.send('Error logged in');
});

router.get('/google/logout');

module.exports = router;
