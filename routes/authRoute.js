import express from "express";
import {
  registerController,
  loginController,
  ForgotPassword,
} from "../controllers/authController.js";
import { testController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST request handler
router.post("/register", registerController);

router.post("/login", loginController);

router.post("/reset-password", ForgotPassword);

//middleware
router.get("/test", requireSignIn, isAdmin, testController);

export default router;
