const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const authMiddleware = require('../helpers/authMiddleWare');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.userId
    })
    .populate('participants', 'username profileImage')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { participantId } = req.body;
    const existingConversation = await Conversation.findOne({
      participants: { $all: [req.user.userId, participantId] }
    });
    if (existingConversation) {
      return res.json(existingConversation);
    }
    const conversation = new Conversation({
      participants: [req.user.userId, participantId]
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:conversationId/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    })
    .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:conversationId/messages', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const conversationId = req.params.conversationId;
    const message = new Message({
      conversationId,
      sender: req.user.userId,
      content
    });
    await message.save();
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date()
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:conversationId/seen', authMiddleware, async (req, res) => {
  try {
    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        sender: { $ne: req.user._id }
      },
      { seen: true }
    );
    res.json({ message: 'Messages marked as seen' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;