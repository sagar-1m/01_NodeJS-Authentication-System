import { Router } from "express";
import {
  forgotPassword,
  getActiveSessions,
  getUserProfile,
  loginUser,
  logoutAllOtherDevices,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
  terminateSession,
  verifyUser,
} from "../controllers/user.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  apiLimiter,
  loginLimiter,
} from "../middleware/rateLimiter.middleware.js";
import {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
} from "../middleware/validation.middleware.js";

const router = Router();

/**
 * @Publicroutes - No authentication required
 */

router.post("/register", registerValidation, apiLimiter, registerUser);

router.post("/login", loginValidation, loginLimiter, loginUser);

router.post("/forgot-password", forgotPasswordValidation, forgotPassword);

router.put("/reset-password/:token", resetPasswordValidation, resetPassword);

router.get("/verify/:token", verifyUser);

router.post("/refresh-token", refreshToken);

/**
 * @Protectedroutes - Authentication required
 */

router.get("/profile", protect, getUserProfile);

router.get("/sessions", protect, getActiveSessions);

router.post("/logout-all-other-devices", protect, logoutAllOtherDevices);

router.delete("/sessions/:sessionId", protect, terminateSession);

router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
    data: {
      user: req.user.toPublicJSON(),
    },
  });
});

router.post("/logout", protect, logoutUser);

export default router;
