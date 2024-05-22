import express from "express";
import {
  registerController,
  loginController,
  resetPasswordController,
  forgetPasswordController,
  generateOtpController,
  singleUserController,
  addWishlistController,
  removeWishlistController,
  getWishlistController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST request handler
router.post("/register", registerController);

router.post("/login", loginController);

router.post("/reset-password", resetPasswordController);

router.post("/forgot-password", forgetPasswordController);

router.post("/generate-otp", generateOtpController);

router.get("/user-details/:email", singleUserController);

router.post("/add-wishlist", addWishlistController);

router.post("/remove-wishlist", removeWishlistController);

router.get("/wishlist/:email", getWishlistController);

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
export default router;
