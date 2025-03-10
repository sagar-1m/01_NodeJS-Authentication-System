import { successResponse, errorResponse } from "../utils/apiResponse.utils.js";
import { generateSecureToken, hashToken } from "../utils/token.utils.js";
import User from "../models/user.model.js";
import { sendVerificationEmail } from "../utils/mailer.utils.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (req, res) => {
  try {
    // Step 1: Get user input data from the request body
    const { name, email, password } = req.body;

    // Step 2: Validate user input data - also there are libraries like Zod, yup, Joi, express-validator, etc. to validate user input data
    if (!name || !email || !password) {
      return errorResponse(res, 400, "Please fill in all fields");
    }

    console.log("Validation passed, proceed to the next step...");
    console.log("User input data: ", { name, email, password });

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
      // for testing purpose , I am setting isVerified to true
      isVerified: true, // <- this bypasses the email verification process
    });

    if (!user) {
      return errorResponse(res, 500, "User registration failed");
    }

    // Create a verification token for the user using crypto module from node.js
    // const token = crypto.randomBytes(32).toString("hex");
    // console.log("Verification token: ", token);
    // user.verificationToken = token;

    // // set token expiration time (24 hrs from now)
    // user.verificationTokenTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // await user.save();

    // // Send verification email
    // const emailSent = await sendVerificationEmail(user.email, token);

    // if (!emailSent) {
    //   console.warn("Verification email could not be sent");
    // }

    console.log("User created successfully: ", user);

    // Step 5: Return the user data in the response - this is with verification email message
    // return res.status(201).json({
    //   success: true,
    //   // message: emailSent
    //   //   ? "User created successfully. Please check your email to verify your account."
    //   //   : "User created successfully but verification email could not be sent. Please contact support.",
    //   message:
    //     "User created successfully and automatically verified for testing purpose",
    //   user: filterData,
    // });

    // Step 5: Return the user data in the response - this is without verification email message
    return successResponse(
      res,
      201,
      "User created successfully and automatically verified for testing purpose",
      { user: user.toPublicJSON() }
    );
  } catch (error) {
    return errorResponse(res, 500, "Registration failed", error.message);
  }
};

// verification controller
// const verifyUser = async (req, res) => {
//   try {
//     // Step 1: Get verification token from the request params means from the URL
//     const { token } = req.params;

//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         message: "Verification token is required",
//       });
//     }

//     // Step 2: Find user based on token
//     const user = await User.findOne({ verificationToken: token });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid verification token",
//       });
//     }

//     // Step 3: Check if token has expired
//     const currentTime = new Date();
//     if (currentTime > user.verificationTokenTime) {
//       return res.status(400).json({
//         success: false,
//         message: "Verification token has expired",
//       });
//     }

//     // Step 4: set isVerfied field true if verified
//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationTokenTime = undefined;
//     await user.save();

//     // Step 4: return response
//     return res.status(200).json({
//       success: true,
//       message: "User verified successfully",
//     });
//   } catch (error) {
//     console.error("Verification failed:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Verification failed. Please try again later.",
//     });
//   }
// };

// LOGIN CONTROLLER

// Step 1: Get user input data from the request body
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 2: Validate user input data
    if (!email || !password) {
      return errorResponse(res, 400, "Please enter email and password");
    }

    // Step 3: Check if the user exists in the database
    const user = await User.findOne({ email }).select("+password"); // to select password field which is hidden by default in the schema

    if (!user) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    // Step 4: Check if the password is correct or not using bcrypt compare method
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    // Step 5: Check if the user is verified or not using isVerified field
    // if (!user.isVerified) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Please verify your account",
    //   });
    // }

    // Step 6: use JWT sign method to generate a token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Step 7: set token in the cookie with cookie parser middleware and with cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // csrf protection with strict
    };

    res.cookie("token", token, cookieOptions);

    // Step 9: Return the user data in the response
    return successResponse(
      res,
      200,
      "User logged in successfully",
      {
        user: user.toPublicJSON(),
      },
      token
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Login failed. Please try again later.",
      error.message
    );
  }
};

// Profile controller
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

// Forgot password controller
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

    // Step 3: Generate a password reset token
    const resetToken = generateSecureToken();

    // Step 4: Hash the reset token and set it to the user document
    user.passwordResetToken = hashToken(resetToken);

    // Step 5: Set the token expiration time
    user.passwordResetTokenTime = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    // Step 6: Send password reset email

    // or send the reset token in the response for testing purpose
    return successResponse(
      res,
      200,
      "Password reset token sent to your email",
      { resetToken } // remove this in production
    );
  } catch (error) {
    return errorResponse(res, 500, "Error resetting password", error.message);
  }
};

// Reset password controller
const resetPassword = async (req, res) => {
  try {
    // Get token and new password from the request body and params
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!resetToken || !password) {
      return errorResponse(res, 400, "Token and password are required");
    }

    // Hash the token to compare it with the hashed token in the database
    const hashedToken = hashToken(resetToken);

    // Find user based on the hashed token and token expiration time
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenTime: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, 400, "Invalid or expired token");
    }

    // Set new password and reset the token fields
    user.password = password; // this will be hashed in the pre-save middleware

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

export {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
};
