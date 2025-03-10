// auth middleware to protect routes
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // Step 1: Check if token is in the request header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Get token from the request header
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      // Get token from the request cookies
      token = req.cookies.token;
    }

    // Debugging purpose
    console.log("Token extracted:", token ? "Found" : "Not found");

    // If token is not found in the request header or cookies return an error
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      // Step 2: Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified, user ID:", decoded.id);

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
      console.error("Token verification failed:", error);
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
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
