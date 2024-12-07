const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const Assignment = require('../models/Assignment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../helpers/authMiddleWare')

async function userData(user) {
  const organizationMembers = await User.find(
    { organization: user.organization, _id: { $ne: user._id } }, // Exclude current user
    { password: 0 } // Exclude password field
  );
  const projects = await Project.find({ teamMembers: user._id });
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

// Route de connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifiez si l'utilisateur existe
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

// Route pour obtenir la liste des utilisateurs
router.get('/users',async (req, res) => {
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


module.exports = router;