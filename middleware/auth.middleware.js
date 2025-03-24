// auth middleware to protect routes
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import BlacklistedToken from "../models/blacklistedTokens.model.js";
import { extractTokenFromRequest } from "../utils/token.utils.js";
import { config } from "../config/env.config.js";

const protect = async (req, res, next) => {
  try {
    // Step 1: Extract token from cookies first, then fallback to headers
    const token = req.cookies.accessToken || extractTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Session expired, Please login again",
      });
    }

    try {
      // Step 2: Verify the token
      const decoded = jwt.verify(token, config.jwt.accessToken.secret);

      // Step 3: Check if the user exists in the database
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found with this id",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Middleware to restrict access to certain routes based on user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

export { protect, authorize };
