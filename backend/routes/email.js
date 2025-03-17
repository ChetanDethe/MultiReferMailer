const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Send Emails
// router.post('/send-emails', async (req, res) => {
//   const { email, recipients } = req.body;

//   console.log('Request Body:', req.body); // Log the request body for debugging

//   try {
//     // Fetch the logged-in user
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log('User not found for email:', email);
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Validate email and appPassword
//     if (!user.email || !user.appPassword) {
//       console.log('Missing email or appPassword for user:', user);
//       return res.status(400).json({ error: 'User email or app password missing' });
//     }

//     // Validate email template
//     const { subject, body } = user.emailTemplate || {};
//     if (!subject || !body) {
//       console.log('Email template missing for user:', user);
//       return res.status(400).json({ error: 'Email template subject or body missing' });
//     }

//     // Validate recipients
//     if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
//       console.log('Invalid or empty recipients:', recipients);
//       return res.status(400).json({ error: 'Recipients list is invalid or empty' });
//     }

//     // Configure Nodemailer with the user's email and appPassword
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: user.email, // Use the logged-in user's email
//         pass: user.appPassword, // Use the logged-in user's appPassword (not hashed)
//       },
//     });

//     const cvPath = user.cv;

//     // Send emails to each recipient
//     for (const recipient of recipients) {
//       if (!recipient.Email) {
//         console.log('Skipping recipient due to missing email:', recipient);
//         continue; // Skip recipients without an email
//       }

//       let personalizedSubject = subject
//         .replace('[CompanyName]', recipient.Company || '')
//         .replace('[FirstName]', recipient['First Name'] || '');
//       let personalizedBody = body
//         .replace('[CompanyName]', recipient.Company || '')
//         .replace('[FirstName]', recipient['First Name'] || '')
//         .replace('[SenderFirstName]', user.firstName || '')
//         .replace('[SenderLastName]', user.lastName || '');

//       try {
//         await transporter.sendMail({
//           from: user.email,
//           to: recipient.Email,
//           subject: personalizedSubject,
//           text: personalizedBody,
//           attachments: cvPath ? [{ path: cvPath }] : [],
//         });
//         console.log(`Email sent to ${recipient.Email}`);
//       } catch (emailErr) {
//         console.error(`Failed to send email to ${recipient.Email}:`, emailErr.message);
//       }
//     }

//     res.json({ message: 'Email sending process completed' });
//   } catch (err) {
//     console.error('Error in send-emails route:', err);
//     res.status(500).json({ error: err.message });
//   }
// });
// Helper function to add a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Send Emails
router.post('/send-emails', async (req, res) => {
  const { email, recipients } = req.body;

  console.log('Request Body:', req.body); // Log the request body for debugging

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.email || !user.appPassword) {
      console.log('Missing email or appPassword for user:', user);
      return res.status(400).json({ error: 'User email or app password missing' });
    }

    const { subject, body } = user.emailTemplate || {};
    if (!subject || !body) {
      console.log('Email template missing for user:', user);
      return res.status(400).json({ error: 'Email template subject or body missing' });
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      console.log('Invalid or empty recipients:', recipients);
      return res.status(400).json({ error: 'Recipients list is invalid or empty' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user.email,
        pass: user.appPassword,
      },
    });

    const cvPath = user.cv;

    // Send emails to each recipient with a delay
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      if (!recipient.Email) {
        console.log('Skipping recipient due to missing email:', recipient);
        continue;
      }

      let personalizedSubject = subject
        .replace(/\[CompanyName\]/g, recipient.Company || '')
        .replace(/\[FirstName\]/g, recipient['First Name'] || '');

      let personalizedBody = body
        .replace(/\[CompanyName\]/g, recipient.Company || '')
        .replace(/\[FirstName\]/g, recipient['First Name'] || '')
        .replace(/\[SenderFirstName\]/g, user.firstName || '')
        .replace(/\[SenderLastName\]/g, user.lastName || '')
        .replace(/\[Your Email Address\]/g, user.email || '');

      try {
        await transporter.sendMail({
          from: user.email,
          to: recipient.Email,
          subject: personalizedSubject,
          text: personalizedBody,
          attachments: cvPath ? [{ path: cvPath }] : [],
        });
        console.log(`Email sent to ${recipient.Email} (${i + 1}/${recipients.length})`);
      } catch (emailErr) {
        console.error(`Failed to send email to ${recipient.Email}:`, emailErr.message);
      }

      // Add a 1-second delay between emails to avoid Gmail rate limits
      if (i < recipients.length - 1) {
        await delay(1000); // 1000ms = 1 second
      }
    }

    res.json({ message: 'Email sending process completed' });
  } catch (err) {
    console.error('Error in send-emails route:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;