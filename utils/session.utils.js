// Get device info from request headers

import RefreshToken from "../models/refreshToken.model.js";
import { config } from "../config/env.config.js";

const getDeviceInfo = (req) => {
  const deviceInfo = req.headers["user-agent"] || "Unknown device";
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  return { deviceInfo, ipAddress };
};

const updateExistingSession = async (
  userId,
  deviceInfo,
  refreshToken,
  ipAddress,
  expiryDate
) => {
  // Finds and updates an existing session for the device
  try {
    // Find existing session
    const existingToken = await RefreshToken.findOne({
      user: userId,
      deviceInfo,
    });

    if (existingToken) {
      // Update existing session
      existingToken.token = refreshToken;
      existingToken.lastUsed = new Date();
      existingToken.ipAddress = ipAddress;
      existingToken.expiresAt = expiryDate;
      await existingToken.save();
      return true;
    }
  } catch (error) {
    console.error("Error updating existing session:", error);
    return false;
  }
};

const enforceDeviceLimit = async (userId, maxDevices = null) => {
  // Deletes oldest session if user exceeds device/session limit
  try {
    const deviceLimit = maxDevices || config.security.maxDevicesPerUser;

    // count user's active sessions using refresh tokens
    const tokenCount = await RefreshToken.countDocuments({ user: userId });

    if (tokenCount > deviceLimit) {
      // Delete oldest session
      const oldestToken = await RefreshToken.findOne({
        user: userId,
      })
        .sort({ lastUsed: 1 })
        .exec();

      if (oldestToken) {
        await RefreshToken.findByIdAndDelete({ _id: oldestToken._id });
        return true;
      }
    }
  } catch (error) {
    console.error("Error enforcing device limit:", error);
    return false;
  }
};

const formatSessionsData = (sessions, currentToken) => {
  // Formats session data for API response
  return sessions.map((session) => ({
    id: session._id,
    deviceInfo: session.deviceInfo,
    ipAddress: session.ipAddress,
    lastUsed: session.lastUsed,
    issuedAt: session.issuedAt,
    isCurrent: currentToken === session.token,
  }));
};

export {
  getDeviceInfo,
  updateExistingSession,
  enforceDeviceLimit,
  formatSessionsData,
};
