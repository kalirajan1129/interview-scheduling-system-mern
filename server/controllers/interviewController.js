const Interview = require('../models/Interview');

exports.createInterview = async (req, res) => {
  try {
    const { candidateName, role, date, slots } = req.body;

    const interview = new Interview({
      candidateName,
      role,
      date,
      slots
    });

    await interview.save();

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const availableSlots = interview.slots.filter(slot => !slot.isBooked);

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    await Interview.findByIdAndDelete(id);

    res.json({ message: 'Interview deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Interview.findByIdAndUpdate(id, req.body, {
      new: true
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};