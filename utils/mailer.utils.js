// mailer utility to send token to user for verification

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendVerificationEmail = async (email, token) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.MAILTRAP_SENDEREMAIL,
        pass: process.env.MAILTRAP_SENDEREMAIL_PASS,
      },
    });

    // Verification URL (frontend or backend)
    const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${token}`;

    // Email content
    const mailOptions = {
      from: `"Authentication App" <${process.env.MAILTRAP_SENDEREMAIL}>`,
      to: email,
      subject: "Please verify your email address",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p>Thank you for registering! Please verify your email address to complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p>${verificationUrl}</p>
          <p>This verification link will expire in 24 hours.</p>
          <p>If you did not create an account, please ignore this email.</p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent: %s ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

export { sendVerificationEmail };
