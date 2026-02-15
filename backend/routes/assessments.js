const express = require('express');
const Assessment = require('../models/Assessment');
const Submission = require('../models/Submission');

const router = express.Router();

// Get all assessments (no auth required for MVP)
router.get('/', async (req, res) => {
  try {
    const { type, difficulty } = req.query;
    let filter = { isActive: true };
    
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    const assessments = await Assessment.find(filter)
      .select('-questions.correctAnswer');
    
    res.json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get assessments' 
    });
  }
});

// Get specific assessment
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }
    
    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get assessment' 
    });
  }
});

// Submit assessment
router.post('/submit', async (req, res) => {
  try {
    const { assessmentId, answers, userId, timeSpent } = req.body;
    
    // Get assessment to calculate score
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }
    
    // Calculate score
    let score = 0;
    let correct = 0;
    
    assessment.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += question.marks || 1;
        correct++;
      }
    });
    
    // Save submission
    const submission = new Submission({
      userId,
      assessmentId,
      answers,
      score,
      correct,
      total: assessment.questions.length,
      timeSpent,
      status: 'completed'
    });
    
    await submission.save();
    
    res.json({
      success: true,
      message: 'Assessment submitted successfully',
      data: {
        score,
        correct,
        total: assessment.questions.length,
        percentage: Math.round((correct / assessment.questions.length) * 100)
      }
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit assessment' 
    });
  }
});

module.exports = router;
