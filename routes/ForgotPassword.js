const router = require("express").Router();
const { sign, verify } = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcrypt");

router.get("/forgot",  (req, res, next) => {});
router.post("/forgot", async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.send({ error: "user is not registered" });
    return;
  }

  const forgotPasswordToken = sign({ email: user.email, role: user.roles }, process.env.FORGOT_PASSWORD_TOKEN_SECRET, { expiresIn: "15m" });
  const link = `${process.env.CALLBACK_URL}/password/reset/${user.id}/${forgotPasswordToken}`;

  // res.json("Password reset link has been sent");
  // TODO send link to email
  res.json(link);
});

router.get("/reset/:id/:token", async(req, res, next) => {
  const { id, token } = req.params;

  const user = await User.findOne({ where: { id } });
  if (!user) {
    res.send("invalid user id");
    return;
  }

  verify(token, process.env.FORGOT_PASSWORD_TOKEN_SECRET, (err, decoded) => {
    if (err) res.sendStatus(403).send();
    else {
      const email = decoded.email;
      res.redirect(`${process.env.APP_URL}/password/forgot/${id}/${token}`)
    }
  });
});
router.post("/reset/:id/:token", async(req, res, next) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ where: { id } });
  if (!user) {
    res.send("invalid user id");
    return;
  }

  verify(token, process.env.FORGOT_PASSWORD_TOKEN_SECRET, (err, decoded) => {
    if (err) res.sendStatus(403).send();
    else {
      const email = decoded.email;
      bcrypt.hash(password, 10).then(async (hashed) => {
        await User.update({ ...user, password: hashed }, { where: { email: user.email } });
        res.json('password changed')
      });
    }
  });

});

module.exports = router;
