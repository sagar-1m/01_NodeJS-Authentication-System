// Rate Limiting Middleware for API requests to prevent abuse of the API by a single user or IP address by limiting the number of requests they can make within a certain time frame.

// This middleware uses the express-rate-limit package to implement rate limiting based on the IP address of the client making the request.

import rateLimit from "express-rate-limit";

// General API rate limiter - by IP address
const apiLimiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true,
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
  keyGenerator: (req) =>
    req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
});

// Specific rate limiter for login requests by IP address
const loginLimiter = rateLimit({
  max: 5, // 5 login attempts allowed
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true,
  message: {
    success: false,
    message:
      "Too many login attempts from this IP, please try again after 15 minutes.",
  },
  keyGenerator: (req) =>
    req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
});

export { apiLimiter, loginLimiter };
