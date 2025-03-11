// model for blacklisted tokens

import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema(
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
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // set the token to expire after the expiresAt date has passed (0 seconds)

const BlacklistedToken = mongoose.model(
  "BlacklistedToken",
  blacklistedTokenSchema
);

export default BlacklistedToken;
