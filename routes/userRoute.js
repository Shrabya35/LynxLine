import express from "express";
import {
  singleUserController,
  addWishlistController,
  removeWishlistController,
  getWishlistController,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/user-details/:email", singleUserController);

router.post("/add-wishlist", addWishlistController);

router.post("/remove-wishlist", removeWishlistController);

router.get("/wishlist/:email", getWishlistController);

export default router;
