const nodemailer = require('nodemailer');

const sendEmail = async (options, emailUser, emailPass) => {
  if (!emailUser || !emailPass) {
    throw new Error('Email credentials missing');
  }

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  // Define email options
  const mailOptions = {
    from: `InterviewHub <${emailUser}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
