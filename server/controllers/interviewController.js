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