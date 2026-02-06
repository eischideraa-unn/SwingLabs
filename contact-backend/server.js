// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const server = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Middleware
server.use(cors()); 
server.use(express.json()); 
server.use(express.urlencoded({ extended: true })); 
server.use(express.static(path.join(__dirname, 'frontend')));

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log(' Email server is ready to send messages');
  }
});

// Contact form endpoint
server.post('/api/contact', async (req, res) => {
  try {
    const { email, message } = req.body;

    // Validation
    if (!email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide both email and message' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Message length validation
    if (message.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message must be at least 10 characters long' 
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is too long (max 1000 characters)' 
      });
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: process.env.EMAIL_USER, 
      replyTo: email, 
      subject: `New Contact Form Message from ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #ffc37a; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #555;">From:</strong> 
              <span style="color: #333;">${email}</span>
            </p>
            
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #555;">Date:</strong> 
              <span style="color: #333;">${new Date().toLocaleString()}</span>
            </p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
            <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px;">
            <p>This message was sent from your website contact form.</p>
            <p>Reply directly to this email to respond to ${email}</p>
          </div>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    // log success
    console.log(' Email sent successfully:', info.messageId);
    
    // send success response
    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you soon.' 
    });

  } catch (error) {
    console.error(' Error sending email:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later or email us directly.' 
    });
  }
});

// Health check endpoint (to test if server is running)
server.get('/api/health', (req, res) => {
  res.json({ 
    status: 'SwingHub Server is running',
    service: 'Contact Form API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
server.get('/',(req,res) =>{
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
})



// 404 handler
server.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(` Admin email: ${process.env.EMAIL_USER}`);
  console.log(` API endpoint: http://localhost:${PORT}/api/contact`);

});