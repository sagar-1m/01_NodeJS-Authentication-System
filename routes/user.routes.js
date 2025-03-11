import { Router } from "express";
import {
  forgotPassword,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
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

/**
 * @route POST /api/v1/users/register
 * @desc Register a new user
 */
router.post("/register", registerValidation, apiLimiter, registerUser);

/**
 * @route POST /api/v1/users/login
 * @desc Login a registered user
 */
router.post("/login", loginValidation, loginLimiter, loginUser);

/**
 * @route POST /api/v1/users/forgot-password
 * @desc Forgot password - request reset token
 */
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);

/**
 * @route PUT /api/v1/users/reset-password/:resetToken
 * @desc Reset password
 */
router.put(
  "/reset-password/:resetToken",
  resetPasswordValidation,
  resetPassword
);

/**
 * @route GET /api/v1/users/verify/:token
 * @desc Verify user account - email verification - currently disabled
 *
 */
// router.get("/verify/:token", verifyUser);

/**
 * @Protectedroutes - Authentication required
 */

/**
 * @route GET /api/v1/users/profile
 * @desc Get current user profile
 * @access Private
 */
router.get("/profile", protect, getUserProfile);

/**
 * @route GET /api/v1/users/admin
 * @desc Get admin profile - Admin only
 * @access Private/admin
 */
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
    data: {
      user: req.user.toPublicJSON(),
    },
  });
});

/**
 * @route POST /api/v1/users/logout
 * @desc Logout user
 * @access Private
 */
router.post("/logout", protect, logoutUser);

export default router;
