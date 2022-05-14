const express = require("express");
const router = express.Router();
const { Project, User } = require("../models");
const asyncHandler = require("express-async-handler");
const { validateToken, validateRole } = require("../middlewares/Auth");

router.get(
  "/",
  validateToken,
  asyncHandler(async (req, res) => {
    // TODO: update /project so that not all projects is return
    const user = await User.findOne({ where: { email: req.user } });
    if (user.role === 2) {
      const projects = await Project.findAll();
      res.json(projects);
    } else {
      const projects = await Project.findAll({ where: { UserId: user.id } });
      res.json(projects);
    }
  }),
);

router.post(
  "/",
  validateToken,
  asyncHandler(async (req, res) => {
    let project = req.body;

    const user = await User.findOne({ where: { email: req.user } });

    if (!project.name || !project.description || !user) {
      res.sendStatus(401);
      throw new Error("body is null");
    }
    project.UserId = user.id;
    await Project.create(project);
    res.json(project);
  }),
);

router.get(
  "/:id",
  validateToken,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const project = await Project.findOne({ where: { id } });
    res.json(project);
  }),
);

router.put(
  "/:id",
  validateToken,
  asyncHandler(async (req, res) => {
    const project = req.body;
    const id = req.params.id;

    try {
      await Project.update({ ...project }, { where: { id } });
      res.sendStatus(202);
    } catch (error) {
      res.sendStatus(401);
    }
  }),
);

module.exports = router;
