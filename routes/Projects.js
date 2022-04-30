const express = require("express");
const router = express.Router();
const { Project } = require("../models");

router.get("/", (req, res) => {
  res.json("Project Registered");
});

router.post("/", async (req, res) => {
  const project = req.body;
  await Project.create(project);
  res.json(project);
});

module.exports = router;
