import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceInfo: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      default: "Unknown",
    },
    issuedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    lastUsed: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster lookups and auto-deletion of expired tokens
refreshTokenSchema.index({ user: 1, deviceInfo: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // 0 seconds to delete expired tokens

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
