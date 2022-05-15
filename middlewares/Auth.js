const { verify, sign } = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models");

const validateToken = (req, res, next) => {
  const authorization = req.header("authorization");

  if (!authorization) {
    res.json({ error: "user not logged in" });
  } else {
    const token = authorization.split(" ")[1];
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
      res.json("You dont have permission.");
    } else {
      next();
    }
  };
};

const passport = require("passport");
const res = require("express/lib/response");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github2').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/auth/google/callback`,
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      let user = await User.findOne({
        where: { email: profile.emails[0].value },
      });
      if (!user) {
        const [row, created] = await User.findOrCreate({
          where: {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            role: 1,
          },
        });
        user = row;
      }
      
      return cb(null, user);
    },
  ),
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/auth/facebook/callback`,
      profileFields: ['id','first_name','last_name', 'email']
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      
      let user = await User.findOne({
        where: { email: profile.emails[0].value },
      });
      if (!user) {
        const [row, created] = await User.findOrCreate({
          where: {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            role: 1,
          },
        });
        user = row;
      }

      return cb(null, user);
    },
  ),
);
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/auth/github/callback`,
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      
      let user = await User.findOne({
        where: { email: profile.emails[0].value },
      });
      if (!user) {
        const [row, created] = await User.findOrCreate({
          where: {
            firstName: profile.displayName,
            lastName: '(github)',
            email: profile.emails[0].value,
            role: 1,
          },
        });
        user = row;
      }

      return cb(null, user);
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
