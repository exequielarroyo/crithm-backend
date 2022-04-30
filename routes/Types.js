const express = require('express');
const router = express.Router();
const { Type } = require('../models');
//const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  res.json('Choose your type of system');
});

router.post("/", async(req, res) => {
  const type = req.body;
  await Type.create(type)
  res.json(type)
});
module.exports = router ;