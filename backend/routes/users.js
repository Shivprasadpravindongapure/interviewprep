const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { profile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        profile,
        isFirstTime: false 
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('progress profile');
    
    res.json({
      progress: user.progress,
      profile: user.profile,
      readiness: {
        overall: user.progress.overallReadiness,
        dsa: user.progress.dsaScore,
        web: user.progress.webScore,
        dbms: user.progress.dbmsScore,
        weakAreas: user.progress.weakAreas
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user goals
router.put('/goals', auth, async (req, res) => {
  try {
    const { targetCompanies, skills } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: {
          'profile.targetCompanies': targetCompanies,
          'profile.skills': skills
        }
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
