const express = require('express');
const router = express.Router();
const { Project } = require('../models');
const asyncHandler = require('express-async-handler');
const { validateToken } = require('../middlewares/Auth');

router.get(
  '/',
  validateToken,
  asyncHandler(async (req, res) => {
    // TODO: update /project so that not all projects is return
    
    const projects = await Project.findAll();
    res.json(projects);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const project = req.body;

    if (!project.name || !project.description) {
      res.status(401);
      throw new Error('body is null');
    }

    await Project.create(project);
    res.json(project);
  }),
);

module.exports = router;
