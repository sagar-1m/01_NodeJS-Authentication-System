// Token Generation Utility

import crypto from "crypto";

/**
 * Generate a secure random token
 * @param {Number} bytes - Number of bytes to generate for the token (default: 32)
 * @returns {String} - Hexadecimal token string
 */

const generateSecureToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

/**
 * Hash the token using SHA256 algorithm
 * @param {String} token - Token to hash
 * @returns {String} - Hashed token
 */

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export { generateSecureToken, hashToken };
