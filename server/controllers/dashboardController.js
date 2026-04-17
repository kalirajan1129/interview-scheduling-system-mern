const Interview = require('../models/Interview');

exports.getDashboardStats = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ date: 1 });

    let totalSlots = 0;
    let bookedSlots = 0;
    
    const todayInterviews = [];
    const upcomingInterviews = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    interviews.forEach(interview => {
      // Stats
      totalSlots += interview.slots.length;
      interview.slots.forEach(slot => {
        if (slot.isBooked) bookedSlots++;
      });

      // Date comparison
      const interviewDate = new Date(interview.date);
      interviewDate.setHours(0, 0, 0, 0);

      const driveItem = {
        _id: interview._id,
        title: interview.title,
        role: interview.role,
        date: interview.date,
        totalCandidates: interview.candidates.length,
        bookedCandidates: interview.candidates.filter(c => c.status === 'Booked').length,
        totalSlots: interview.slots.length,
      };

      if (interviewDate.getTime() === today.getTime()) {
        todayInterviews.push(driveItem);
      } else if (interviewDate.getTime() > today.getTime()) {
        upcomingInterviews.push(driveItem);
      }
    });

    res.json({
      stats: {
        totalDrives: interviews.length,
        totalSlots,
        bookedSlots,
        availableSlots: totalSlots - bookedSlots
      },
      todayInterviews,
      upcomingInterviews
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};