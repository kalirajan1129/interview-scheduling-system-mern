const Interview = require('../models/Interview');

exports.getPublicDriveDetails = async (req, res) => {
  try {
    const { driveId, token } = req.params;

    const interview = await Interview.findById(driveId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview drive not found' });
    }

    // Authenticate candidate via token
    const candidate = interview.candidates.find(c => c.token === token);
    if (!candidate) {
      return res.status(401).json({ message: 'Invalid or expired booking link' });
    }

    // We only send available slots so someone else's booked slots aren't visible
    const availableSlots = interview.slots.filter(slot => !slot.isBooked);

    res.json({
      title: interview.title,
      role: interview.role,
      date: interview.date,
      candidate: {
        name: candidate.name,
        email: candidate.email,
        status: candidate.status,
        bookedSlotTime: candidate.bookedSlotTime
      },
      availableSlots
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const { driveId, token, time } = req.body;

    const interview = await Interview.findById(driveId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview drive not found' });
    }

    // Verify candidate
    const candidate = interview.candidates.find(c => c.token === token);
    if (!candidate) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (candidate.status === 'Booked') {
      return res.status(400).json({ message: 'You have already booked a slot' });
    }

    // Find slot
    const slot = interview.slots.find(s => s.time === time);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Check duplicate booking
    if (slot.isBooked) {
      return res.status(400).json({ message: 'Sorry, this slot was just booked by someone else. Please select another slot.' });
    }

    // Book slot
    slot.isBooked = true;
    slot.bookedBy = candidate.name; 

    // Update candidate
    candidate.status = 'Booked';
    candidate.bookedSlotTime = time;

    await interview.save();

    res.json({ message: 'Slot booked successfully', bookedSlotTime: time });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};