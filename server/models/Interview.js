const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slots: [
    {
      time: String,
      isBooked: {
        type: Boolean,
        default: false
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);