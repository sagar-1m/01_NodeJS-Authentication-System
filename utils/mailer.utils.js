// mailer utility to send token to user for verification

import nodemailer from "nodemailer";
import { config } from "../config/env.config.js";

const sendVerificationEmail = async (email, token) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass,
      },
    });

    // Verification URL (frontend or backend)
    const verificationUrl = `${config.urls.base}/api/v1/users/verify/${token}`;

    // Email content
    const mailOptions = {
      from: `"Authentication App" <${config.email.senderEmail}>`,
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
          <p>This verification link will expire in 10 mins.</p>
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

// forgot password email
const sendForgotPasswordEmail = async (email, token) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass,
      },
    });

    // Reset password URL (frontend or backend)
    const resetPasswordUrl = `${config.urls.base}/api/v1/users/reset-password/${token}`;

    // Email content
    const mailOptions = {
      from: `"Authentication App" <${config.email.senderEmail}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
          <p>We received a request to reset your password. If you did not make this request, simply ignore this email.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetPasswordUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p>${resetPasswordUrl}</p>
          <p>This link will expire in 10 mins.</p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Forgot password email sent: %s ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    return false;
  }
};

export { sendVerificationEmail, sendForgotPasswordEmail };
