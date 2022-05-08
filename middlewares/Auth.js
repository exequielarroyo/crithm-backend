const { verify } = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

const validateToken = (req, res, next) => {
  const authorization = req.header('authorization');

  if (!authorization) {
    res.json({ error: 'user not logged in' });
  } else {
    const token = authorization.split(' ')[1];
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) res.sendStatus(403).send();
      req.user = decoded.email;
      next();
    });
  }
};

const validateRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(parseInt(req.body.role))) {
      res.json('You dont have permission.');
    } else {
      next();
    }
  };
};

const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: '95060154180-a08kjbapmbn6m9eh1i2o0tbkr8o9vnqr.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3002/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
      console.log(refreshToken);
      User.findOrCreate({
        where: {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          picture: null,
          company: null,
          number: null,
          address: 'Street, Barangay, City, Province, Country',
          occupation: 'Student',
          email: profile.emails[0].value,
          role: 1,
          password: 'hashed',
          // refreshToken: refreshToken,
        },
      });
      return cb(null, profile);
    },
  ),
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

module.exports = { validateToken, validateRole };
