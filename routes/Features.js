const express = require('express');
const router = express.Router();
const { Feature } = require('../models');


router.get('/', (req, res) => {
  res.json('Choose your feature');
});

router.post("/", async(req, res) => {
  const feature = req.body;
  await Feature.create(feature)
  res.json(feature)
});
module.exports = router ;