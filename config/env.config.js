// configuration module for environment variables

import dotenv from "dotenv";

dotenv.config();

// Required environment variables
const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRESIN",
  "JWT_REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRESIN",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "MAILTRAP_SENDEREMAIL",
];

// Optional environment variables
const optionalEnvVars = {
  PORT: 5000,
  NODE_ENV: "development",
  EMAIL_SECURE: false,
  BASE_URL: "http://localhost:5000",
  FRONTEND_URL: "http://localhost:3000",
  MAX_DEVICES_PER_USER: 2,
};

// Validate environment variables
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`Environment variable ${key} is missing.`);
    process.exit(1);
  }
}

// set default value for optional environment variables
for (const [key, defaultValue] of Object.entries(optionalEnvVars)) {
  if (!process.env[key]) {
    process.env[key] = String(defaultValue);
  }
}

// Parse time strings like "5m", "2h", "7d" to milliseconds
const parseTimeString = (timeString) => {
  if (!timeString) return 0;
  if (typeof timeString === "number") return timeString;

  const match = String(timeString).match(/^(\d+)([smhd])$/);
  if (!match) return 0;

  const time = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return time * 1000;
    case "m":
      return time * 60 * 1000;
    case "h":
      return time * 60 * 60 * 1000;
    case "d":
      return time * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
};

// structured config object
const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  isProduction: process.env.NODE_ENV === "production",

  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI,
  },

  // JWT
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: parseTimeString(process.env.ACCESS_TOKEN_EXPIRESIN),
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: parseTimeString(process.env.REFRESH_TOKEN_EXPIRESIN),
    },
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    senderEmail: process.env.MAILTRAP_SENDEREMAIL,
  },

  security: {
    maxDevicesPerUser: parseInt(process.env.MAX_DEVICES_PER_USER || "2", 10),
  },

  urls: {
    base: process.env.BASE_URL,
    frontend: process.env.FRONTEND_URL,
  },
};

export { config, parseTimeString };
