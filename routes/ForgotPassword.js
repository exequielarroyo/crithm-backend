const router = require("express").Router();
const { sign, verify } = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: "crithm.cf@gmail.com", pass: "abcd_1234" } });

router.post("/forgot", async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.send({ error: "user is not registered" });
    return;
  }

  const forgotPasswordToken = sign({ email: user.email, role: user.roles }, process.env.FORGOT_PASSWORD_TOKEN_SECRET, { expiresIn: "15m" });
  const link = `${process.env.CALLBACK_URL}/password/reset/${user.id}/${forgotPasswordToken}`;

  var mailOptions = {
    from: "crithm.cf@gmail.com",
    to: user.email,
    subject: "Crithm | FORGOT YOUR PASSWORD",
    // TODO put html here
    html: `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #0a1529;
      }
      .container {
        width: 100%;
        table-layout: fixed;
        background: #0a1529;
      }
      .content {
        background: #030921;
        max-width: 600px;
      }
      .outer {
        margin: 0 auto;
        width: 100%;
        max-width: 600px;
        border-spacing: 0;
        font-family: sans-serif;
        color: rgb(177, 177, 177);
      }
      .upper {
        border-bottom: 1px solid rgba(200, 200, 200, 0.192);
      }
    </style>
  </head>

  <body>
    <center class="container">
      <div class="content">
        <table class="outer" align="center">
          <tr>
            <td class="upper">
              <table width="100%" style="border-spacing: 0; margin-top: 30px; margin-bottom: 30px">
                <tr>
                  <td style="padding: 10px; text-align: center">
                    <img src="https://www.crithm.cf/assets/images/logo.png" width="100px" alt="logo" />
                    <h3 style="font-family: korataki; color: white">CRITHM</h3>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center">
              <h1 style="margin-bottom: 50px; color: #3291a4">Reset Your Password</h1>
              <p style="margin-bottom: 50px; font-size: large">
                We received a request to reset your password. <br />
                Click the link below to do so.
              </p>
              <a style="color: #387aff" href="${link}">Reset password</a>
              <p style="margin-bottom: 50px; margin-top: 50px; font-size: large">
                This link will automatically expire in <span style="font-weight: bold">15 minutes</span>. In <br />
                case the above button doesn't work, please request again.
              </p>
            </td>
          </tr>
          <tr style="background: #0b172d">
            <td style="text-align: center; padding: 15px">
              <table width="100%" style="border-spacing: 0">
                <a>
                  <img src="https://www.crithm.cf/assets/images/logo.png" width="50px" alt="logo" />
                  <p style="color: rgb(203, 203, 203)">crithm.cf</p>
                </a>
              </table>
            </td>
          </tr>
          <tr>
            <td style="text-align: center">
              <p style="color: rgb(203, 203, 203)">© 2022 Crithm | All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    </center>
  </body>
</html>

    `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.json(link);
});

router.get("/reset/:id/:token", async (req, res, next) => {
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
      res.redirect(`${process.env.APP_URL}/password/forgot/${id}/${token}`);
    }
  });
});
router.post("/reset/:id/:token", async (req, res, next) => {
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
        await User.update({ ...user, password: hashed }, { where: { email } });
        res.json("password changed");
      });
    }
  });
});

module.exports = router;
