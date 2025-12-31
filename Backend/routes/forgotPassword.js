const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User'); // Adjust the path as necessary

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your SMTP host
  port: 587,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a password reset token
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    // Create reset URL
    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email', error: error.message });
      }
      res.status(200).json({ message: 'Recovery email sent' });
    });

  } catch (error) {
    console.error('Server error in forgot-password route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

