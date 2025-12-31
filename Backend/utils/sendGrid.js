const sgMail = require('@sendgrid/mail');

// Set the API key for SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generic email-sending function
const sendEmail = async (to, subject, text, html) => {
  const msg = {
    to,
    from: 'aadidevsraj@gmail.com', // Your verified SendGrid email address
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error);
    throw new Error('Email sending failed');
  }
};

module.exports = sendEmail;
