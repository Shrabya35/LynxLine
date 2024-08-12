import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
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

    const orders = await orderModel
      .find({})
      .skip(skip)
      .limit(limit)
      .populate("items.productId", "name price");

    const totalOrders = await orderModel.countDocuments({});

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
      message: "Error fetching orders by user",
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
    const { id } = req.params;

    const order = await orderModel.findById(id).session(session);
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
export const searchOrdersController = async (req, res) => {
  try {
    const { orderId, userId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (orderId) {
      query.orderId = orderId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (!orderId && !userId) {
      return res.status(400).send({
        success: false,
        message: "Please provide either an orderId or a userId to search",
      });
    }

    const orders = await orderModel
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("items.productId", "name price");

    const totalOrders = await orderModel.countDocuments(query);

    res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      totalOrders,
      page: parseInt(page),
      totalPages: Math.ceil(totalOrders / limit),
      orders,
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
