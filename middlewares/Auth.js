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
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:3002/auth/google/callback",
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      let user = await User.findOne({
        where: { email: profile.emails[0].value },
      });
      if (!user) {
        user = await User.findOrCreate({
          where: {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            picture: null,
            company: null,
            number: null,
            address: "Street, Barangay, City, Province, Country",
            occupation: "Student",
            email: profile.emails[0].value,
            role: 1,
            password: "google",
            // refreshToken: refreshToken,
          },
        });
      }

      return cb(null, user);
    },
  ),
);

passport.serializeUser(async (user, cb) => {
  // const accessToken = sign(
  //   { email: user.email, role: user.roles },
  //   process.env.ACCESS_TOKEN_SECRET,
  //   { expiresIn: "30s" },
  // );
  // const refreshToken = sign(
  //   { email: user.email, role: user.roles },
  //   process.env.REFRESH_TOKEN_SECRET,
  //   { expiresIn: "1d" },
  // );

  // await User.update(
  //   { ...user, refreshToken },
  //   { where: { email: user.email } },
  // );

  // res.cookie("jwt", refreshToken, {
  //   httpOnly: true,
  //   sameSite: "None",
  //   secure: true,
  //   maxAge: 24 * 60 * 60 * 1000,
  // });
  // res.json({ role: user.role, accessToken });

  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  User.findOne({ where: { email: user.email } }).then((user) => {
    cb(null, user);
  });
});

module.exports = { validateToken, validateRole };
