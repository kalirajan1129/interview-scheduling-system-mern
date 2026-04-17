const Interview = require('../models/Interview');

exports.bookSlot = async (req, res) => {
  try {
    const { interviewId, time } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Find slot
    const slot = interview.slots.find(s => s.time === time);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Check already booked
    if (slot.isBooked) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // Book slot
    slot.isBooked = true;

    await interview.save();

    res.json({ message: 'Slot booked successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};