import express from "express";
import {
  countOrderController,
  createOrderController,
  getOrderController,
  searchOrderController,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-order", createOrderController);

router.get("/count-orders", countOrderController);

router.get("/get-orders", getOrderController);

router.post("/search-order/:search", searchOrderController);

router.put("/update-status/:orderId", updateOrderStatus);

export default router;
