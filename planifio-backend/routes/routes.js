
const express = require('express');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../helpers/authMiddleWare')

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
    console.log("stage 0");

    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Comparez le mot de passe fourni avec celui stocké
    console.log(password)
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Generate a JWT token
    console.log("stage 1");
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("stage 2");

    // Fetch user-specific assignments
    const assignments = await Assignment.find({ userID: user._id });

    console.log("stage 3");

    // Réponse en cas de succès
    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        organization: user.organization,
        profileImage: user.profileImage? user.profileImage : null
      },
      assignments 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// In your backend routes
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    // Find the user, excluding the password
    const user = await User.findById(req.user.userId).select('-password');
    
    // Fetch user assignments
    const assignments = await Assignment.find({ userID: req.user.userId });

    res.json({ 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        organization: user.organization,
        profileImage: user.profileImage? user.profileImage : null
      },
      assignments
    });
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


module.exports = router;