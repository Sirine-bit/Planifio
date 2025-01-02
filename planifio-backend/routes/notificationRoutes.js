const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../helpers/authMiddleWare');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.userId })
      .populate('instigator', 'username profileImage')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(501).json({ message: error.message });
  }
});

router.put('/:notificationId/click', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, recipient: req.user.userId },
      { isClicked: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { recipientId, content, severity, instigatorId } = req.body;
    const notification = new Notification({
      recipient: recipientId,
      content,
      severity,
      instigator: instigatorId || null,
      instigatorImage: req.body.instigatorImage
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
