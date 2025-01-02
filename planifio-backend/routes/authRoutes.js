const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../helpers/authMiddleWare');
const { sendInvitationEmail } = require('../helpers/mail');
const { userData } = require('../helpers/userData');

router.post('/signup', async (req, res) => {
  const { username, email, password, organization, image } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      organization,
      profileImage: image
    });

    await newUser.save();

    const testPassword = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification test after signup:', testPassword);
    res.status(201).json({ message: 'Account created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password: rawPassword } = req.body;
  const password = rawPassword.trim();
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
      { userId: user._id, email: user.email },
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

router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    const json = await userData(user);
    res.json({ ...json });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/invite', authMiddleware, async (req, res) => {
  try {
    const { senderFullName, fullName, email, password, organization } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
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
