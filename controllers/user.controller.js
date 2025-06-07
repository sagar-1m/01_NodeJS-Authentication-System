// Models
import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";

// Utils
import { successResponse, errorResponse } from "../utils/apiResponse.utils.js";
import {
  extractTokenFromRequest,
  generateAccessToken,
  generateRefreshToken,
  generateSecureToken,
} from "../utils/token.utils.js";
import {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  getCookieClearingOptionsV5,
} from "../utils/cookie.utils.js";
import {
  verifyCredentials,
  blacklistAccessToken,
} from "../utils/auth.utils.js";
import {
  enforceDeviceLimit,
  getDeviceInfo,
  updateExistingSession,
  formatSessionsData,
} from "../utils/session.utils.js";
import {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} from "../utils/mailer.utils.js";
import { config, parseTimeString } from "../config/env.config.js";

// REGISTER CONTROLLER
const registerUser = async (req, res) => {
  try {
    // Step 1: Get user input data from the request body
    const { name, email, password } = req.body;

    // Step 2: Validate user input data - also there are libraries like Zod, yup, Joi, express-validator, etc. to validate user input data
    if (!name || !email || !password) {
      return errorResponse(res, 400, "Please fill in all fields");
    }

    // Step 3: Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 409, "User already exists with this email");
    }

    // Step 4: Create a new user in the database
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
    });

    if (!user) {
      return errorResponse(res, 500, "User registration failed");
    }

    //Create a verification token for the user
    const token = generateSecureToken();
    console.log("Verification token: ", token);
    user.verificationToken = token;

    // verification token expiration time is 10 mins
    user.verificationTokenTime = Date.now() + parseTimeString("10m");

    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, token);

    if (!emailSent) {
      console.warn("Verification email could not be sent");
    }

    console.log("User created successfully: ", user);

    // Step 5: Return the user data in the response
    return successResponse(
      res,
      201,
      emailSent
        ? "User registered successfully. Please check your email to verify your account"
        : "User registered successfully, but verification email could not be sent",
      { user: user.toPublicJSON() }
    );
  } catch (error) {
    return errorResponse(res, 500, "Registration failed", error.message);
  }
};

// VERIFY USER CONTROLLER
const verifyUser = async (req, res) => {
  try {
    // Step 1: Get verification token from the request params means from the URL
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    // Step 2: Find user based on token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification token",
      });
    }

    // Step 3: Check if token has expired
    const currentTime = new Date();
    if (currentTime > user.verificationTokenTime) {
      return res.status(400).json({
        success: false,
        message: "Verification token has expired",
      });
    }

    // Step 4: set isVerfied field true if verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenTime = undefined;
    await user.save();

    // Step 4: return response
    return res.status(200).json({
      success: true,
      message: "Account verified successfully, you can now login",
    });
  } catch (error) {
    console.error("Verification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed. Please try again later.",
    });
  }
};

// LOGIN CONTROLLER

// Step 1: Get user input data from the request body
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifing credential using auth utils
    const authResult = await verifyCredentials(email, password);

    if (!authResult.success) {
      return errorResponse(res, 401, "Invalid credentials", authResult.message);
    }

    if (authResult.notVerified) {
      return errorResponse(
        res,
        401,
        "Please verify your email before logging in"
      );
    }

    const { user } = authResult;

    // Step 2: Using token utils to generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Step 3: Using session utils to get device info and ip address
    const { deviceInfo, ipAddress } = getDeviceInfo(req);
    const refreshExpiry = new Date(
      Date.now() + config.jwt.refreshToken.expiresIn
    );

    const sessionUpdated = await updateExistingSession(
      user._id,
      deviceInfo,
      refreshToken,
      ipAddress,
      refreshExpiry
    );

    if (!sessionUpdated) {
      await enforceDeviceLimit(user._id, 2);
      await RefreshToken.create({
        token: refreshToken,
        user: user._id,
        deviceInfo,
        ipAddress,
        issuedAt: new Date(),
        lastUsed: new Date(),
        expiresAt: refreshExpiry,
      });
    }

    // Step 5: using cookie utils to set cookies
    res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
    res.cookie(
      "refreshToken",
      refreshToken,
      getRefreshTokenCookieOptions(refreshExpiry)
    );

    // Step 6: Return the user data in the response
    return successResponse(res, 200, "User logged in successfully", {
      user: user.toPublicJSON(),
    });
  } catch (error) {
    return errorResponse(res, 500, "Login failed.", error.message);
  }
};

// REFRESH TOKEN CONTROLLER
const refreshToken = async (req, res) => {
  try {
    // Step 1: Get the refresh token from the request cookies
    const tokenFromCookie = req.cookies.refreshToken;

    if (!tokenFromCookie) {
      return errorResponse(res, 401, "No refresh token found");
    }

    // Find the refresh token in the database
    const refreshTokenDoc = await RefreshToken.findOne({
      token: tokenFromCookie,
    });

    if (!refreshTokenDoc) {
      return errorResponse(res, 401, "Invalid refresh token");
    }

    // verify expiration time
    if (new Date() > refreshTokenDoc.expiresAt) {
      await RefreshToken.deleteOne({ _id: refreshTokenDoc._id });
      return errorResponse(res, 401, "Refresh token has expired");
    }

    // Find the user based on the refresh token
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    // Generate a new refresh token
    const newRefreshToken = generateRefreshToken(user._id);

    // Update the refresh token in the database
    refreshTokenDoc.token = newRefreshToken;
    refreshTokenDoc.lastUsed = new Date();
    refreshTokenDoc.ipAddress = req.ip || req.connection.remoteAddress;

    // token expiration time
    const refreshExpiry = new Date(
      Date.now() + config.jwt.refreshToken.expiresIn
    );
    refreshTokenDoc.expiresAt = refreshExpiry;

    await refreshTokenDoc.save();

    // Generate a new access token
    const accessToken = generateAccessToken(user._id);

    // Set new tokens in the response cookies
    res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
    res.cookie(
      "refreshToken",
      newRefreshToken,
      getRefreshTokenCookieOptions(refreshExpiry)
    );

    return successResponse(res, 200, "Tokens refreshed successfully");
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error refreshing access token",
      error.message
    );
  }
};

// GET USER PROFILE CONTROLLER
const getUserProfile = async (req, res) => {
  try {
    // Step 1: req.user is set in the protect middleware after verifying the token

    const user = await User.findById(req.user._id);

    // Step 3: Return the user data in the response
    return successResponse(res, 200, "User profile", {
      user: user.toPublicJSON(),
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error retrieving user profile",
      error.message
    );
  }
};

// FORGOT PASSWORD CONTROLLER
const forgotPassword = async (req, res) => {
  try {
    // Step 1: Get user email from the request body
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 400, "Email is required");
    }

    // Step 2: Find user based on email
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, 404, "No user found with this email");
    }

    //Create a reset token for the user
    const token = generateSecureToken();
    user.passwordResetToken = token;
    user.passwordResetTokenTime = Date.now() + parseTimeString("10m");

    await user.save();

    // Step 3: Send password reset email
    const emailSent = await sendForgotPasswordEmail(user.email, token);

    if (!emailSent) {
      console.warn("Verification email could not be sent");
    }

    return successResponse(
      res,
      200,
      emailSent
        ? "Password reset email sent. Please check your email"
        : "Password reset email could not be sent"
    );
  } catch (error) {
    return errorResponse(res, 500, "Error resetting password", error.message);
  }
};

// RESET PASSWORD CONTROLLER
const resetPassword = async (req, res) => {
  try {
    // Step 1: Get reset token from the request params
    const { token } = req.params;

    if (!token) {
      return errorResponse(res, 400, "Reset token is required");
    }

    // Step 2: Find user based on the reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenTime: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, 400, "Invalid or expired reset token");
    }

    // Step 3: Get new password from the request body
    const { password } = req.body;

    if (!password) {
      return errorResponse(res, 400, "New password is required");
    }

    // Step 4: Update the user password
    user.password = password;

    // Clear the reset token fields
    user.passwordResetToken = undefined;
    user.passwordResetTokenTime = undefined;

    await user.save();

    return successResponse(
      res,
      200,
      "Password reset successful. Please login with your new password"
    );
  } catch (error) {
    return errorResponse(res, 500, "Error resetting password", error.message);
  }
};

// LOGOUT CONTROLLER
const logoutUser = async (req, res) => {
  try {
    // Step 1: Get tokens
    const accessToken = req.cookies.accessToken || extractTokenFromRequest(req);
    const refreshToken = req.cookies.refreshToken;

    // Step 2: Handle refresh token - remove it from the database
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Step 3: using auth utils to Blacklist the access token
    if (accessToken) {
      await blacklistAccessToken(accessToken);
    }

    // Clear the cookies regardless of the token verification status
    res.clearCookie("accessToken", getCookieClearingOptionsV5());

    res.clearCookie("refreshToken", getCookieClearingOptionsV5());

    return successResponse(res, 200, "Logout successfully");
  } catch (error) {
    return errorResponse(res, 500, "Logout failed", error.message);
  }
};

// ACTIVE SESSIONS CONTROLLER
const getActiveSessions = async (req, res) => {
  try {
    // Find all active sessions based on the user id
    const sessions = await RefreshToken.find({ user: req.user._id }).sort({
      lastUsed: -1,
    });

    // Use session utils to format the session data
    const currentToken = req.cookies.refreshToken;
    const formattedSessions = formatSessionsData(sessions, currentToken);

    return successResponse(res, 200, "Active sessions retrieved", {
      sessions: formattedSessions,
    });
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error retrieving active sessions",
      error.message
    );
  }
};

// LOGOUT FROM ALL OTHER DEVICES EXCEPT CURRENT DEVICE
const logoutAllOtherDevices = async (req, res) => {
  try {
    // Get current device refresh token
    const currentToken = req.cookies.refreshToken;

    if (!currentToken) {
      return errorResponse(res, 400, "No refresh token found");
    }

    // Revoke all other sessions except the current session
    const deletedSessions = await RefreshToken.deleteMany({
      user: req.user._id,
      token: { $ne: currentToken },
    });

    return successResponse(
      res,
      200,
      "Logout from all other devices successful",
      { deletedSessions: deletedSessions.deletedCount }
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error logging out from other devices",
      error.message
    );
  }
};

// TERMINATE SPECIFIC SESSION BY DEVICE ID
const terminateSession = async (req, res) => {
  try {
    // Get session id from the request params
    const { sessionId } = req.params;

    if (!sessionId) {
      return errorResponse(res, 400, "Session id is required");
    }

    // Find the session based on the id
    const session = await RefreshToken.findOne({
      _id: sessionId,
      user: req.user._id,
    });

    if (!session) {
      return errorResponse(res, 404, "Session not found");
    }

    // Check if trying to terminate the current session
    if (session.token === req.cookies.refreshToken) {
      // logout current session
      return logoutUser(req, res);
    }

    // Terminate the session
    await RefreshToken.deleteOne({ _id: sessionId });

    return successResponse(res, 200, "Session terminated successfully");
  } catch (error) {
    return errorResponse(res, 500, "Error terminating session", error.message);
  }
};

export {
  registerUser,
  verifyUser,
  loginUser,
  refreshToken,
  getUserProfile,
  forgotPassword,
  resetPassword,
  logoutUser,
  getActiveSessions,
  logoutAllOtherDevices,
  terminateSession,
};
