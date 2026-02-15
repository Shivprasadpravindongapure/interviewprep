const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  googleId: String,
  profile: {
    phone: String,
    college: String,
    degree: String,
    passingYear: Number,
    targetCompanies: [String],
    skills: [String]
  },
  progress: {
    overallReadiness: {
      type: Number,
      default: 0
    },
    dsaScore: {
      type: Number,
      default: 0
    },
    webScore: {
      type: Number,
      default: 0
    },
    dbmsScore: {
      type: Number,
      default: 0
    },
    weakAreas: [String],
    totalSessions: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
  },
  isFirstTime: {
    type: Boolean,
    default: true
  },
  trustScore: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
