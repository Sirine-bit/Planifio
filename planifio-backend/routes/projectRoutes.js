const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('teamMembers');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
