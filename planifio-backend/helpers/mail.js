// File: helpers/mail.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD // Your Gmail app password
  }
});

const sendInvitationEmail = async (recipientEmail, fullName, password, inviterName, organizationName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `You're invited to join ${organizationName} on Planifio`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://firebasestorage.googleapis.com/v0/b/samsar-first.appspot.com/o/logo.png?alt=media&token=5d9d4cdd-0fe1-42b1-afe4-305191c4a2ee" alt="Planifio Logo" style="max-width: 200px; height: auto;">
          </div>

          <!-- Main Content -->
          <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2C3E50; margin-bottom: 20px;">Welcome to Planifio!</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">Hello ${fullName},</p>
            
            <p style="font-size: 16px; line-height: 1.5;">
              <strong>${inviterName}</strong> has invited you to join <strong>${organizationName}</strong> on Planifio - 
              your new workspace for simplified enterprise collaboration.
            </p>

            <!-- Credentials Box -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #4CAF50; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <h3 style="color: #2C3E50; margin-top: 0;">Your Login Credentials</h3>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${recipientEmail}</p>
              <p style="margin: 10px 0;"><strong>Password:</strong> ${password}</p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://planifio.com/login" 
                 style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold;
                        display: inline-block;">
                Log In to Planifio
              </a>
            </div>

            <!-- Security Notice -->
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                🔒 For security reasons, please change your password after your first login.
              </p>
            </div>

            <!-- Features Preview -->
            <div style="margin: 25px 0;">
              <h3 style="color: #2C3E50;">What you can do with Planifio:</h3>
              <ul style="list-style-type: none; padding: 0;">
                <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                  ✓ Collaborate seamlessly with your team
                </li>
                <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                  ✓ Streamline your workflow processes
                </li>
                <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                  ✓ Access all your work tools in one place
                </li>
              </ul>
            </div>

            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Need help? Contact our support team at support@planifio.com
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Welcome to Planifio!

Hello ${fullName},

${inviterName} has invited you to join ${organizationName} on Planifio - your new workspace for simplified enterprise collaboration.

Your Login Credentials:
Email: ${recipientEmail}
Password: ${password}

To get started, visit: https://planifio.com/login

For security reasons, please change your password after your first login.

What you can do with Planifio:
- Collaborate seamlessly with your team
- Streamline your workflow processes
- Access all your work tools in one place

Need help? Contact our support team at support@planifio.com

Best regards,
The Planifio Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendProjectNotificationEmail = async (recipientEmail, recipientName, projectName, projectDescription, startDate, endDate, creatorName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `You've been added to a new project: ${projectName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://firebasestorage.googleapis.com/v0/b/samsar-first.appspot.com/o/logo.png?alt=media&token=5d9d4cdd-0fe1-42b1-afe4-305191c4a2ee" alt="Planifio Logo" style="max-width: 200px; height: auto;">
          </div>

          <!-- Main Content -->
          <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2C3E50; margin-bottom: 20px;">New Project Assignment</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">Hello ${recipientName},</p>
            
            <p style="font-size: 16px; line-height: 1.5;">
              <strong>${creatorName}</strong> has added you to a new project on Planifio.
            </p>

            <!-- Project Details Box -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #4CAF50; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <h3 style="color: #2C3E50; margin-top: 0;">Project Details</h3>
              <p style="margin: 10px 0;"><strong>Project Name:</strong> ${projectName}</p>
              <p style="margin: 10px 0;"><strong>Description:</strong> ${projectDescription}</p>
              <p style="margin: 10px 0;"><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</p>
              <p style="margin: 10px 0;"><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString()}</p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://planifio.com/projects" 
                 style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold;
                        display: inline-block;">
                View Project Details
              </a>
            </div>

            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Need help? Contact our support team at support@planifio.com
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Hello ${recipientName},

${creatorName} has added you to a new project on Planifio.

Project Details:
- Name: ${projectName}
- Description: ${projectDescription}
- Start Date: ${new Date(startDate).toLocaleDateString()}
- End Date: ${new Date(endDate).toLocaleDateString()}

To view the project details, visit: https://planifio.com/projects

Best regards,
The Planifio Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending project notification email:', error);
    throw error;
  }
};

// Add this to your exports
module.exports = {
  sendInvitationEmail,
  sendProjectNotificationEmail
};