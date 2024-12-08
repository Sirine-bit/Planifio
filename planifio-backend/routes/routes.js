const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const Assignment = require('../models/Assignment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../helpers/authMiddleWare')
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const { sendInvitationEmail } = require('../helpers/mail');

async function userData(user) {
  const organizationMembers = await User.find(
    { organization: user.organization, _id: { $ne: user._id } }, // Exclude current user
    { password: 0 } // Exclude password field
  );
  const projects = await Project.find({
    $or: [
      { userId: user._id }, // Condition for the creator
      { teamMembers: user._id } // Condition for team members
    ]
  });
  const assignments = await Assignment.find({ userID: user._id });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      organization: user.organization,
      profileImage: user.profileImage? user.profileImage : null
    },
    organizationMembers,
    projects,
    assignments
  };
}

// Route d'inscription
router.post('/signup', async (req, res) => {
  const { username, email, password, organization, image } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with image
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      organization,
      profileImage: image
    });

    await newUser.save();
    res.status(201).json({ message: 'Account created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '5h' }
    );

    let json = await userData(user);
    res.status(200).json({
      message: 'Login successful', 
      token,
      ...json
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// In your backend routes
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    const json = await userData(user);
    res.json({ ...json });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.post('/assignments', async (req, res) => {
  const { userID, name, details } = req.body;

  try {
    const newAssignment = new Assignment({
      userID,
      name,
      details,
      isDone: false
    });

    await newAssignment.save();

    res.status(201).json({ 
      message: 'Assignment created successfully', 
      assignment: newAssignment 
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Error creating assignment' });
  }
});
  
router.get('/assignments/:userId', async (req, res) => {
  try {
    const assignments = await Assignment.find({ userID: req.params.userId });
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

router.put('/assignments/:id', async (req, res) => {
  try {
    const { isDone } = req.body;
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { isDone },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(updatedAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().populate('teamMembers');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/conversations', authMiddleware, async (req, res) => {
  console.log("Creating conversation");
  console.log(req.body);  
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

// Create new conversation
router.post('/conversations', authMiddleware, async (req, res) => {
  try {
    const { participantId } = req.body;
    
    // Check if conversation already exists
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

// Get messages for a conversation
router.get('/conversations/:conversationId/messages', authMiddleware, async (req, res) => {
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

// Send a message
router.post('/conversations/:conversationId/messages', authMiddleware, async (req, res) => {
  console.log("Sending message");
  try {
    const { content } = req.body;
    const conversationId = req.params.conversationId;

    console.log(content);
    console.log(conversationId);
    console.log(req.user);
    const message = new Message({
      conversationId,
      sender: req.user.userId,
      content
    });

    await message.save();

    // Update conversation's lastMessage and updatedAt
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date()
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark messages as seen
router.put('/conversations/:conversationId/seen', authMiddleware, async (req, res) => {
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

router.get('/notifications', authMiddleware, async (req, res) => {
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

// Mark notification as clicked
router.put('/notifications/:notificationId/click', authMiddleware, async (req, res) => {
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

// Create a new notification (admin or system route)
router.post('/notifications', authMiddleware, async (req, res) => {
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

router.post('/users/invite', authMiddleware, async (req, res) => {
  try {
    const { senderFullName, fullName, email, password, organization } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    console.log(req.user);
    const newUser = new User({
      username: fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      organization: organization,
      role: 'user'
    });

    await newUser.save();

    try {
      await sendInvitationEmail(email, fullName, password, senderFullName, organization);
    } catch (emailError) {
      // If email fails, we still want to create the user but should log the error
      console.error('Failed to send invitation email:', emailError);
      return res.status(201).json({ 
        message: 'User created successfully but failed to send email notification',
        user: newUser
      });
    }

    res.status(201).json({ message: 'User invited successfully' });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ message: 'Failed to invite user' });
  }
});



module.exports = router;