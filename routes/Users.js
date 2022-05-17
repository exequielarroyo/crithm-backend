const express = require("express");
const router = express.Router();
const { User, Project, Plan } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken, validateRole } = require("../middlewares/Auth");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

router.get("/", validateToken, async (req, res) => {
  const user = await User.findOne({ where: { email: req.user }, attributes: { exclude: ['password', 'picture', 'refresh'] }});
  if (user.role === 2){
    const users = await User.findAll({ include: [Project] });
    res.json(users);
  } else if (user.role === 1){
    res.json(user)
  }
  else {
    res.sendStatus(403)
  }
});

router.put('/',validateToken, asyncHandler(async(req,res)=>{
  const user = req.body;
  // const user = await User.findOne({ where: { email: req.user }, attributes: { exclude: ['password', 'picture', 'refresh'] }});
  await User.update({...user }, { where: { email: req.user } });
  res.json(user);
}))

router.put('/update', validateToken, asyncHandler(async(req,res)=>{
    const updatedUser = await User.update({ ...req.body }, { where: { email: req.user } });
    res.json(updatedUser);
}))

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.json({ error: "email is not registered" });
      // res.status(400);
      // throw new Error('User does not exist');
    }

    await bcrypt.compare(password, user.password).then((match) => {
      if (match) {
        const accessToken = sign(
          { email: user.email, role: user.roles },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" },
        );
        const refreshToken = sign(
          { email: user.email, role: user.roles },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" },
        );

        User.update(
          { ...user, refreshToken },
          { where: { email: user.email } },
        );

        // for using thunder
        // res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        // for react
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({ role: user.role, accessToken });
      } else {
        res.json({ error: "Wrong password" });
      }
    });
  }),
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const user = req.body;

    if (!user.firstName || !user.lastName || !user.address) {
      res.send({ error: "error" });
    } else {
      let newUser;
      bcrypt.hash(user.password, 10).then(async (hashed) => {
        newUser = await User.create({
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
          company: user.company,
          number: parseInt(user.number),
          address: user.address,
          occupation: user.occupation,
          email: user.email,
          role: user.role,
          password: hashed,
        });
        res.json({ ...user });
      });
    }
  }),
);

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

router.get(
  "/google",
  // (req,res)=>res.send('logging in with google')
  passport.authenticate("google", { scope: ["email", "profile"] }),
);
router.get(
  "/facebook",
  // (req,res)=>res.send('logging in with google')
  passport.authenticate("facebook", { scope: ["email"] }),
);
router.get(
  "/github",
  // (req,res)=>res.send('logging in with google')
  passport.authenticate("github", { scope: [ 'user:email' ] }),
);

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "http://localhost:3000/dashboard",
//     failureRedirect: "/auth/error",
//   }),
// );
router.get(
  "/google/callback",
  passport.authenticate("google"),
  async (req, res) => {
    const user = req.user;
    // res.send(user)
    const accessToken = sign(
      { email: user.email, role: user.roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" },
    );
    const refreshToken = sign(
      { email: user.email, role: user.roles },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    await User.update(
      { ...user, refreshToken },
      { where: { email: user.email } },
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.data = { role: user.role, accessToken };
    res.redirect(`${process.env.APP_URL}/dashboard`);
  },
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  async (req, res) => {
    // res.send(req.user)

    const user = req.user;
    // res.send(user)
    const accessToken = sign(
      { email: user.email, role: user.roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" },
    );
    const refreshToken = sign(
      { email: user.email, role: user.roles },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    await User.update(
      { ...user, refreshToken },
      { where: { email: user.email } },
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.data = { role: user.role, accessToken };
    res.redirect(`${process.env.APP_URL}/dashboard`);
  },
);
router.get(
  "/github/callback",
  passport.authenticate("github"),
  async (req, res) => {
    // res.send(req.user)

    const user = req.user;
    // res.send(user)
    const accessToken = sign(
      { email: user.email, role: user.roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" },
    );
    const refreshToken = sign(
      { email: user.email, role: user.roles },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    await User.update(
      { ...user, refreshToken },
      { where: { email: user.email } },
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.data = { role: user.role, accessToken };
    res.redirect(`${process.env.APP_URL}/dashboard`);
  },
);

router.get("/user", isLoggedIn, (req, res) => {
  res.send(req.user);
});

router.get("/error", (req, res) => {
  res.send("Error logged in");
});

module.exports = router;
