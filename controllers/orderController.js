import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

export const createOrderController = async (req, res) => {
  try {
    const { userId, total, address } = req.body;

    if (
      !address ||
      !address.country ||
      !address.addressLine1 ||
      !address.city ||
      !address.zipcode ||
      !address.phone
    ) {
      return res
        .status(400)
        .json({ message: "All address fields are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const items = user.shoppingBag.map((item) => ({
      productId: item.product,
      quantity: item.quantity,
    }));

    const orderId = nanoid(5);

    const session = await orderModel.startSession();
    session.startTransaction();

    try {
      const newOrder = new orderModel({
        orderId,
        items,
        userId,
        total,
        address,
      });
      await newOrder.save({ session });

      for (const item of items) {
        const product = await productModel
          .findById(item.productId)
          .session(session);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        product.quantity -= item.quantity;
        await product.save({ session });
      }

      user.shoppingBag = [];
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).send({
        success: true,
        message: "Order Created Successfully",
        newOrder,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Creating order",
      error: error.message,
    });
  }
};
export const getOrderController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const filter = status ? { status } : {};

    const orders = await orderModel
      .find(filter)
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items.productId", "name price")
      .populate("userId", "name email");

    const totalOrders = await orderModel.countDocuments(filter);

    res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      totalOrders,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching orders",
      error,
    });
  }
};

export const countOrderController = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments({});
    const pendingOrders = await orderModel.countDocuments({
      status: "pending",
    });
    const processingOrders = await orderModel.countDocuments({
      status: "processing",
    });
    const deliveredOrders = await orderModel.countDocuments({
      status: "delivered",
    });
    const cancelledOrders = await orderModel.countDocuments({
      status: "cancelled",
    });

    res.status(200).json({
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to count orders", error });
  }
};

export const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId).session(session);
    if (!order) {
      throw new Error("Order not found");
    }

    if (status === "cancelled") {
      for (const item of order.items) {
        const product = await productModel
          .findById(item.productId)
          .session(session);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        product.quantity += item.quantity;
        await product.save({ session });
      }
    }

    order.status = status;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).send({
      success: true,
      message: "Order Status updated successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Updating order status",
      error: error.message,
    });
  }
};
export const searchOrderController = async (req, res) => {
  const searchTerm = req.params.search;
  try {
    let query = {};

    if (mongoose.Types.ObjectId.isValid(searchTerm)) {
      query = { $or: [{ _id: searchTerm }, { orderId: searchTerm }] };
    } else {
      query = { orderId: searchTerm };
    }

    const order = await orderModel
      .findOne(query)
      .populate("items.productId", "name price")
      .populate("userId", "name email phone");

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Searched Order fetched successfully",
      order,
    });
  } catch (error) {
    console.error("Error searching orders: ", error);
    res.status(500).send({
      success: false,
      message: "Error searching orders",
      error: error.message,
    });
  }
};
