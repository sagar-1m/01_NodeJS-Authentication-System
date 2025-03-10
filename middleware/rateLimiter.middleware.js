// Rate Limiting Middleware for API requests to prevent abuse of the API by a single user or IP address by limiting the number of requests they can make within a certain time frame.

// This middleware uses the express-rate-limit package to implement rate limiting based on the IP address of the client making the request.

import rateLimit from "express-rate-limit";

// Create a rate limiter with the following options:
// - max: maximum number of requests allowed within the windowMs time frame
// - windowMs: time frame in milliseconds for which the max number of requests is allowed
// - message: error message to send when the limit is exceeded
const apiLimiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true,
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Specific rate limiter for login requests with different options
const loginLimiter = rateLimit({
  max: 5, // 5 login attempts allowed
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true,
  message: {
    success: false,
    message:
      "Too many login attempts from this IP, please try again after 15 minutes.",
  },
});

export { apiLimiter, loginLimiter };
