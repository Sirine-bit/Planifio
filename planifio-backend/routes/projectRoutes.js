const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendProjectNotificationEmail } = require('../helpers/mail');
const authMiddleware = require('../helpers/authMiddleWare');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      userId: req.user.userId
    });
    await project.save();

    const creator = await User.findById(req.user.userId);
    
    const notificationPromises = project.teamMembers.map(async (memberId) => {
      const member = await User.findById(memberId);
      if (!member) return null;

      const notification = new Notification({
        recipient: memberId,
        content: `You have been added to a new project: ${project.name}`,
        severity: 'low',
        instigator: req.user.userId,
        type: 'project',
        reference: project._id
      });
      await notification.save();

      try {
        await sendProjectNotificationEmail(
          member.email,
          member.username,
          project.name,
          project.description,
          project.startDate,
          project.endDate,
          creator.username
        );
      } catch (emailError) {
        console.error('Failed to send email to:', member.email, emailError);
      }

      return notification;
    });

    await Promise.all(notificationPromises);

    res.status(201).json({
      message: 'Project created and notifications sent',
      project
    });
  } catch (error) {
    console.error('Error in project creation:', error);
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
