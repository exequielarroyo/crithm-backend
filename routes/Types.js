const express = require('express');
const router = express.Router();
const { Type } = require('../models');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  res.json('you are now logged in');
});
