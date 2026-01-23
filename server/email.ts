import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_CONFIG = {
    recipient: 'ansp345@gmail.com',
    from: process.env.EMAIL_FROM || 'noreply@innovativeminds.lk',
};

// Create transporter
// Note: You'll need to configure SMTP settings in environment variables
const createTransporter = () => {
    // For development, you can use Gmail SMTP or a service like Mailtrap
    // For production, use a proper SMTP service

    if (process.env.SMTP_HOST) {
        // Production SMTP configuration
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Development: Log emails to console instead of sending
        return nodemailer.createTransport({
            streamTransport: true,
            newline: 'unix',
            buffer: true,
        });
    }
};

interface EnquiryData {
    name: string;
    email: string;
    phone: string;
    program: string;
    message?: string;
}

export async function sendEnquiryNotification(enquiry: EnquiryData): Promise<boolean> {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: EMAIL_CONFIG.from,
            to: EMAIL_CONFIG.recipient,
            subject: `New Enquiry: ${enquiry.program}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2d8659 0%, #1e5f3f 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #2d8659; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🎓 New Enquiry Received</h2>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Institute of Innovative Minds</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">${enquiry.name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${enquiry.email}">${enquiry.email}</a></div>
              </div>
              
              <div class="field">
                <div class="label">📱 Phone:</div>
                <div class="value"><a href="tel:${enquiry.phone}">${enquiry.phone}</a></div>
              </div>
              
              <div class="field">
                <div class="label">📚 Interested Program:</div>
                <div class="value"><strong>${enquiry.program}</strong></div>
              </div>
              
              ${enquiry.message ? `
              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value">${enquiry.message}</div>
              </div>
              ` : ''}
              
              <div class="footer">
                <p>This enquiry was submitted through the Innovative Minds website.</p>
                <p>Please respond to the enquirer as soon as possible.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
            text: `
New Enquiry Received - Institute of Innovative Minds

Name: ${enquiry.name}
Email: ${enquiry.email}
Phone: ${enquiry.phone}
Interested Program: ${enquiry.program}
${enquiry.message ? `Message: ${enquiry.message}` : ''}

Please respond to this enquiry as soon as possible.
      `,
        };

        const info = await transporter.sendMail(mailOptions);

        // Log in development mode
        if (!process.env.SMTP_HOST) {
            console.log('📧 Email Preview (Development Mode):');
            console.log('To:', EMAIL_CONFIG.recipient);
            console.log('Subject:', mailOptions.subject);
            console.log('---');
            console.log(mailOptions.text);
            console.log('---');
        } else {
            console.log('✅ Email sent successfully:', info.messageId);
        }

        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
}
