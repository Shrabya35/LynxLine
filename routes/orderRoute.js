import express from "express";
import {
  countOrderController,
  createOrderController,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-order", createOrderController);

router.get("/count-orders", countOrderController);

export default router;
