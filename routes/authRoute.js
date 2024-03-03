import express from "express";
import {
  registerController,
  loginController,
  resetPasswordController,
  forgetPasswordController,
  generateOtpController,
} from "../controllers/authController.js";
import { testController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST request handler
router.post("/register", registerController);

router.post("/login", loginController);

router.post("/reset-password", resetPasswordController);

router.post("/forgot-password", forgetPasswordController);

router.post("/generate-otp", generateOtpController);

//middleware
router.get("/test", requireSignIn, isAdmin, testController);

export default router;
