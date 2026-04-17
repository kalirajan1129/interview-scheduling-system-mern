const Interview = require('../models/Interview');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');

exports.createInterview = async (req, res) => {
  try {
    const { title, role, date, candidates, slots } = req.body;

    // Attach unique token and default status to each candidate
    const candidatesWithTokens = candidates.map(c => ({
      ...c,
      token: uuidv4(),
      status: 'Pending',
      mailSent: false
    }));

    const interview = new Interview({
      title,
      role,
      date,
      candidates: candidatesWithTokens,
      slots,
      createdBy: req.user ? req.user.id : null
    });

    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    if (!interview) return res.status(404).json({ message: 'Interview drive not found' });
    res.json(interview);
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

exports.sendEmails = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) return res.status(404).json({ message: 'Interview drive not found' });

    // Validate HR Email Configuration
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    if (!user.emailConfig || !user.emailConfig.user || !user.emailConfig.pass) {
      return res.status(400).json({ message: 'EMAIL_NOT_CONFIGURED' });
    }

    let sentCount = 0;

    for (let i = 0; i < interview.candidates.length; i++) {
       const candidate = interview.candidates[i];
       if (candidate.mailSent) continue;

       const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
       const bookingLink = `${clientUrl}/book/${interview._id}/${candidate.token}`;
       
       const emailHtml = `
         <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f5; max-width: 600px; margin: 0 auto; border-radius: 8px;">
           <h2 style="color: #4f46e5;">Interview Invitation</h2>
           <p>Hi <strong>${candidate.name}</strong>,</p>
           <p>You have been invited to schedule your interview for the <strong>${interview.role}</strong> position at our <strong>${interview.title}</strong> drive.</p>
           <p>Please click the button below to pick a time slot that works best for you:</p>
           <a href="${bookingLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px; margin-bottom: 20px;">Choose Interview Slot</a>
           <p>If the button doesn't work, copy and paste this link into your browser:</p>
           <p><a href="${bookingLink}" style="color: #4f46e5; word-break: break-all;">${bookingLink}</a></p>
           <p>Best regards,<br/>${user.name} (HR)</p>
         </div>
       `;

       try {
         await sendEmail({
           email: candidate.email,
           subject: `Interview Invitation: ${interview.role}`,
           html: emailHtml
         }, user.emailConfig.user, user.emailConfig.pass);
         
         candidate.mailSent = true;
         sentCount++;
       } catch (err) {
         console.error(`Failed to send email to ${candidate.email}:`, err);
         // If Gmail rejects the App Password
         if (err.code === 'EAUTH' || err.responseCode === 535 || err.message.includes('Invalid login')) {
            // Clear the invalid credentials from DB so it asks again
            user.emailConfig = { user: null, pass: null };
            await user.save();
            return res.status(401).json({ message: 'EMAIL_AUTH_FAILED' });
         }
       }
    }

    await interview.save();
    res.json({ message: `Successfully sent ${sentCount} new emails.` });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};