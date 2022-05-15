const express = require('express');
const router = express.Router();
const { Type } = require('../models');
//const bcrypt = require('bcrypt');

router.get('/', async(req, res) => {
  const types = await Type.findAll({ attributes: { exclude: ["features"] } });
  res.json(types);
});

router.post("/", async(req, res) => {
  const type = req.body;
  await Type.create(type)
  res.json(type)
});
module.exports = router ;