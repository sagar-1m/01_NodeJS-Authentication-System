// auth middleware to protect routes
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import BlacklistedToken from "../models/blacklistedTokens.model.js";
import { extractTokenFromRequest } from "../utils/token.utils.js";

const protect = async (req, res, next) => {
  try {
    // Step 1: Extract the token from the request header or cookies
    const token = extractTokenFromRequest(req);

    // If token is not found in the request header or cookies return an error
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Step 3: Check if the user exists in the database

      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found with this id",
        });
      }

      // Step 5: Grant access to the protected  route if all the above steps are successful

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
