const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  title: {
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
  candidates: [
    {
      name: String,
      email: String,
      token: String, // Unique token for their booking link
      status: {
        type: String,
        enum: ['Pending', 'Booked'],
        default: 'Pending'
      },
      bookedSlotTime: String,
      mailSent: {
        type: Boolean,
        default: false
      }
    }
  ],
  slots: [
    {
      time: String,
      isBooked: {
        type: Boolean,
        default: false
      },
      bookedBy: {
        type: String, // email or name of candidate
        default: null
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);