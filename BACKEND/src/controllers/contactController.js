// f:\React\family_caregive\BACKEND\src\controllers\contactController.js
const db = require('../models');
const Contact = db.Contact;
const nodemailer = require('nodemailer');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.submitContactForm = async (req, res) => {
  console.log('Received contact form submission:', req.body);
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error('Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    console.log('Contact form submission saved to database:', contact);

    // Send email notification
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `
    };

    console.log('Sending email notification:', mailOptions);
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error('Error submitting contact form:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Server error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};