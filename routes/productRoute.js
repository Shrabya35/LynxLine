import express from "express";
import formidable from "express-formidable";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getPaginatedProductsController,
  productPhotoController,
  singleProductController,
  updateProductController,
  searchProductController,
  addRatingController,
  getProductRatingsController,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/create-product", formidable(), createProductController);

router.put("/update-product/:pid", formidable(), updateProductController);

router.get("/get-product", getProductController);

router.get("/single-product/:slug", singleProductController);

router.get("/product-photo/:pid", productPhotoController);

router.delete("/delete-product/:pid", deleteProductController);

router.get("/paginated-products", getPaginatedProductsController);

router.get("/search-product/:search", searchProductController);

router.post("/add-rating", addRatingController);

router.get("/product-ratings/:productId", getProductRatingsController);

export default router;
