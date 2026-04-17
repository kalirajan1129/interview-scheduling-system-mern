const Interview = require('../models/Interview');

exports.getDashboardStats = async (req, res) => {
  try {
    const interviews = await Interview.find();

    let totalSlots = 0;
    let bookedSlots = 0;

    interviews.forEach(interview => {
      totalSlots += interview.slots.length;

      interview.slots.forEach(slot => {
        if (slot.isBooked) bookedSlots++;
      });
    });

    res.json({
      totalInterviews: interviews.length,
      totalSlots,
      bookedSlots,
      availableSlots: totalSlots - bookedSlots
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};