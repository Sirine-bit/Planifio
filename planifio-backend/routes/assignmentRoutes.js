const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

router.post('/', async (req, res) => {
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

router.get('/:userId', async (req, res) => {
  try {
    const assignments = await Assignment.find({ userID: req.params.userId });
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

router.put('/:id', async (req, res) => {
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
