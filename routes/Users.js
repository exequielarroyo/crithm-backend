const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  res.json('you are now logged in');
});

router.post('/register', async (req, res) => {
  const { firstName, lastName, address, occupation, email, password } = req.body;

  bcrypt.hash(password, 10).then(async (hashed) => {
    await User.create({
      firstName: firstName,
      lastName: lastName,
      picture: null,
      company: null,
      number: null,
      address: address,
      occupation: occupation,
      email: email,
      password: hashed,
    });
  });

  res.json('registered');
});

module.exports = router;
