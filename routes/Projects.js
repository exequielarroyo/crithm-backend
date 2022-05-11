const express = require('express');
const router = express.Router();
const { Project, User } = require('../models');
const asyncHandler = require('express-async-handler');
const { validateToken } = require('../middlewares/Auth');

router.get(
  '/',
  validateToken,
  asyncHandler(async (req, res) => {
    // TODO: update /project so that not all projects is return
    const user = await User.findOne({ where: { email: req.user } });

    const projects = await Project.findAll({where: {UserId: user.id}});
    res.json(projects);
  }),
);

router.post(
  '/',
  validateToken,
  asyncHandler(async (req, res) => {
    let project = req.body;

    const user = await User.findOne({ where: { email: req.user } });
    
    if (!project.name || !project.description || !user) {
      res.status(401);
      throw new Error('body is null');
    }
    project.UserId = user.id;
    await Project.create(project);
    res.json(project);
  }),
);

module.exports = router;
