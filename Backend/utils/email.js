const sgMail = require('@sendgrid/mail');

// Set the API key for SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function specifically for password reset emails
const sendPasswordResetEmail = async (email, resetToken) => {
  const msg = {
    to: email,
    from: 'aadidevsraj@gmail.com', // Replace with your verified SendGrid email
    subject: 'Password Reset Request',
    text: `Click the following link to reset your password: http://localhost:5000/reset-password/${resetToken}`,
    html: `<strong>Click the following link to reset your password:</strong> <a href="http://localhost:5000/reset-password/${resetToken}">Reset Password</a>`,
  };

  try {
    await sgMail.send(msg);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error);
    throw new Error('Failed to send email');
  }
};

module.exports = { sendPasswordResetEmail };
