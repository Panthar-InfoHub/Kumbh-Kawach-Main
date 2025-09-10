import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const body = await request.json();
        console.log(body)
        const { recipientEmail, location, fullName, phone } = body;

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use a service or SMTP server
            auth: {
                user: process.env.EMAIL_USER, // Email address
                pass: process.env.EMAIL_PASS, // App-specific password
            },
        });


        const applicationBody = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Testing Application</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                  <td style="padding: 40px 20px;">
                      <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                          <!-- Header -->
                          <tr>
                              <td style="background-color: #87ceeb; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                  <img src="https://res.cloudinary.com/dq6ubifli/image/upload/v1755982077/logo_white_lymjzr.png" alt="Suraksha Kawach Logo" style="max-width: 150px; height: auto;">
                              </td>
                          </tr>
                          
                          <!-- Content -->
                          <tr>
                              <td style="padding: 40px 30px;">
                                  <h1 style="color: #1e40af; margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">New Testing Application Received</h1>
                                  
                                  <div style="background-color: #dbeafe; border-left: 4px solid #87ceeb; padding: 20px; margin: 20px 0; border-radius: 4px;">
                                      <p style="margin: 0; color: #1e40af; font-weight: bold;">Application Details:</p>
                                      <p style="margin: 10px 0 0 0; color: #374151;">
                                        <strong>Full Name:</strong> ${fullName}<br>
                                          <strong>Phone:</strong> ${phone}<br>
                                          <strong>Email:</strong> ${recipientEmail}<br>
                                          <strong>Location:</strong> ${location}
                                      </p>
                                  </div>
                                  
                                  <p style="color: #374151; margin: 20px 0;">A new candidate has applied for the testing position. Please review their application and take appropriate action.</p>
                                  
                                  <div style="text-align: center; margin: 30px 0;">
                                      <a href="#" style="background-color: #87ceeb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Review Application</a>
                                  </div>
                                  
                                  <!-- Added team note section -->
                                  <div style="background-color: #f0f9ff; border: 1px solid #87ceeb; padding: 20px; margin: 30px 0; border-radius: 6px; text-align: center;">
                                      <p style="color: #1e40af; font-size: 14px; font-style: italic; margin: 0;">
                                          <strong>A note from Team Suraksha Kawach:</strong><br>
                                          We appreciate your dedication to security testing and look forward to working with talented individuals like this applicant.
                                      </p>
                                  </div>
                              </td>
                          </tr>
                          
                          <!-- Footer -->
                          <tr>
                              <td style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px;">
                                  <p style="margin: 0; color: #64748b; font-size: 14px;">
                                      © 2024 Suraksha Kawach. All rights reserved.
                                  </p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `

        // Email for sender
        const mailOptionsSender = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `Copy of Your Email`,
            html: applicationBody
        };


        const confirmBody = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Application Confirmation</title>
        </head>

        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0"
                            style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <!-- Header -->
                            <tr>
                                <!-- Updated header background to light blue theme -->
                                <td
                                    style="background-color: #87ceeb; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                                    <img src="https://res.cloudinary.com/dq6ubifli/image/upload/v1755982077/logo_white_lymjzr.png"
                                        alt="Suraksha Kawach Logo" style="max-width: 200px; height: auto;">
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <!-- Updated heading color to blue -->
                                    <h1 style="color: #1e40af; font-size: 24px; margin: 0 0 20px 0; text-align: center;">Thank
                                        You for Your Application!</h1>

                                    <!-- Updated notification box to light blue theme -->
                                    <div
                                        style="background-color: #dbeafe; border: 1px solid #87ceeb; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center;">
                                        <h2 style="color: #1e40af; font-size: 20px; margin: 0 0 10px 0;">Suraksha Kawach Initial
                                            Download</h2>
                                        <!-- CTA Button -->
                                        <div style="text-align: center; margin: 30px 0 0;">
                                            <a href="https://your-app-link.com" style="display: inline-block; background-color: #1e40af; color: #ffffff; 
                    font-size: 16px; font-weight: bold; text-decoration: none; 
                    padding: 12px 30px; border-radius: 6px; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                                Get the App
                                            </a>
                                        </div>

                                    </div>

                                    <!-- Updated text color for better consistency -->
                                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                        We have received your application for the initial download of Surksha Kawach. Our team
                                        will review your application and get back to you with further details soon.
                                    </p>

                                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                        Thank you for your interest in joining Suraksha Kawach!
                                    </p>

                                    <!-- Added team note section -->
                                    <div
                                        style="background-color: #f0f9ff; border: 1px solid #87ceeb; padding: 20px; margin: 30px 0; border-radius: 6px; text-align: center;">
                                        <p style="color: #1e40af; font-size: 14px; font-style: italic; margin: 0;">
                                            <strong>Team Suraksha Kawach!!</strong><br>
                                        </p>
                                    </div>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td
                                    style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                                    <!-- Updated footer text color -->
                                    <p style="color: #64748b; font-size: 14px; margin: 0;">
                                        This is an automated confirmation from Suraksha Kawach<br>
                                        Please keep this email for your records.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `

        // Email for recipient
        const mailOptionsRecipient = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: "Thank you, for applying for Suraksha Kawach Inital User",
            html: confirmBody
        };

        // Send both emails
        await transporter.sendMail(mailOptionsSender);
        await transporter.sendMail(mailOptionsRecipient);

        return new Response(JSON.stringify({ message: 'Emails sent successfully!' }), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Failed to send email', error }), {
            status: 500,
        });
    }
}
