const express = require('express');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Submission = require('../models/Submission');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get admin dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const activeToday = await User.countDocuments({
      role: 'student',
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    const submissions = await Submission.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$percentage' } } }
    ]);
    
    const avgScore = submissions.length > 0 ? submissions[0].avgScore : 0;
    
    const flaggedSubmissions = await Submission.countDocuments({ status: 'flagged' });

    res.json({
      totalUsers,
      activeToday,
      avgScore: Math.round(avgScore),
      issues: flaggedSubmissions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create assessment
router.post('/assessments', adminAuth, async (req, res) => {
  try {
    const assessment = new Assessment({
      ...req.body,
      createdBy: req.user._id
    });
    
    await assessment.save();
    await assessment.populate('createdBy', 'name');
    
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all assessments (admin view)
router.get('/assessments', adminAuth, async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update assessment
router.put('/assessments/:id', adminAuth, async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name');
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete assessment
router.delete('/assessments/:id', adminAuth, async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all submissions
router.get('/submissions', adminAuth, async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('userId', 'name email')
      .populate('assessmentId', 'title type')
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get platform reports
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const userStats = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: null, total: { $sum: 1 } } }
    ]);

    const submissionStats = await Submission.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          avgScore: { $avg: '$percentage' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);

    const popularAssessments = await Submission.aggregate([
      { $group: { _id: '$assessmentId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'assessments',
          localField: '_id',
          foreignField: '_id',
          as: 'assessment'
        }
      }
    ]);

    res.json({
      userStats: userStats[0] || { total: 0 },
      submissionStats,
      popularAssessments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
