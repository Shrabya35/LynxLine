import express from "express";
import {
  singleUserController,
  addWishlistController,
  removeWishlistController,
  getWishlistController,
  getShoppingBagController,
  addShoppingBagController,
  removeShoppingBagController,
  updateQuantityController,
  getShoppingBagPriceController,
  getUserProductRating,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/user-details/:email", singleUserController);

router.post("/add-wishlist", addWishlistController);

router.post("/remove-wishlist", removeWishlistController);

router.get("/wishlist/:email", getWishlistController);

router.get("/shoppingBag/:email", getShoppingBagController);

router.post("/add-shoppingBag", addShoppingBagController);

router.post("/remove-shoppingBag", removeShoppingBagController);

router.put("/updateQuantity/:email", updateQuantityController);

router.get("/shoppingBag-total/:email", getShoppingBagPriceController);

router.get("/:userId/product-ratings/:productId", getUserProductRating);

export default router;
