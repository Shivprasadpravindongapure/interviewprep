const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeSpent: Number
  }],
  score: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true
  },
  recordingUrl: String,
  feedback: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    aiScore: Number
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'flagged'],
    default: 'completed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
