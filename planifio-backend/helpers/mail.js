const ElasticMail = require('nodelastic');

const client = new ElasticMail('3DED1CB6F94EE5CD65596CD6623D467DDF2F3E7AFA49120F9C3045B1941F34C1E73CEAC00088D686136109121CA4CAEC');

const sendInvitationEmail = async (recipientEmail, fullName, password, inviterName, organizationName) => {
  try {
    const response = await client.send({
      from: 'chater.forarduinouse@gmail.com',
      fromName: 'Planifio',
      subject: `You're invited to join ${organizationName} on Planifio`,
      msgTo: [recipientEmail],
      bodyHtml: `
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
      bodyText: `
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
    });

    return response.success;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendInvitationEmail
};