import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

export const singleUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "user details fetched",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting user details",
      error,
    });
  }
};

export const addWishlistController = async (req, res) => {
  try {
    const { email, productId } = req.body;
    const user = await userModel.findOne({ email }).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.wishlist) {
      user.wishlist = [];
    }

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const removeWishlistController = async (req, res) => {
  try {
    const { email, productId } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );
    await user.save();

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWishlistController = async (req, res) => {
  try {
    const { email } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const user = await userModel.findOne({ email }).populate({
      path: "wishlist",
      populate: { path: "category" },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const total = user.wishlist.length;
    const paginatedWishlist = user.wishlist.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      message: "Paginated wishlist fetched successfully",
      total,
      page,
      pages: Math.ceil(total / limit),
      wishlist: paginatedWishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addShoppingBagController = async (req, res) => {
  try {
    const { email, productId, quantity } = req.body;

    const user = await userModel
      .findOne({ email })
      .populate("shoppingBag.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingItem = user.shoppingBag.find(
      (item) => item.product._id.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.shoppingBag.push({ product: productId, quantity });
    }

    await user.save();

    return res.status(200).json({ message: "Product added to Shopping Bag" });
  } catch (error) {
    console.error("Error in adding Shopping Bag:", error);
    res
      .status(500)
      .json({ message: "Error in adding Shopping Bag", error: error.message });
  }
};

export const updateQuantityController = async (req, res) => {
  const { productId, quantity, email } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const user = await userModel
      .findOne({ email })
      .populate("shoppingBag.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedShoppingBag = user.shoppingBag.map((item) => {
      if (item.product._id.toString() === productId) {
        item.quantity = quantity;
      }
      return item;
    });

    user.shoppingBag = updatedShoppingBag;
    await user.save();

    res.status(200).json({ shoppingBag: user.shoppingBag });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeShoppingBagController = async (req, res) => {
  try {
    const { email, productId } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.shoppingBag = user.shoppingBag.filter(
      (item) => !item.product.equals(productId)
    );

    await user.save();

    res.status(200).json({ message: "Product removed from Shopping Bag" });
  } catch (error) {
    console.error("Error removing product from shopping bag:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getShoppingBagController = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await userModel.findOne({ email }).populate({
      path: "shoppingBag.product",
      populate: { path: "category" },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const total = user.shoppingBag.length;
    const shoppingBag = user.shoppingBag;

    res.status(200).json({
      success: true,
      message: "Shopping Bag fetched successfully",
      total,
      shoppingBag,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getShoppingBagPriceController = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await userModel
      .findOne({ email })
      .populate("shoppingBag.product");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let totalPrice = 0;
    let subTotal = 0;
    let totalItems = 0;
    let shippingFee = 5;

    if (user.shoppingBag && Array.isArray(user.shoppingBag)) {
      user.shoppingBag.forEach((item) => {
        if (item.product && item.product.price && item.quantity) {
          subTotal += item.product.price * item.quantity;
          totalItems += item.quantity;
        } else {
          console.warn(`Invalid shopping bag item for user: ${user.email}`);
        }
      });

      totalPrice = subTotal + shippingFee;
    } else {
      console.warn(
        `Shopping bag missing or not an array for user: ${user.email}`
      );
    }

    res
      .status(200)
      .json({ total: totalPrice, subtotal: subTotal, totalItems: totalItems });
  } catch (error) {
    console.error("Error in calculating total price:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserProductRating = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      console.log(`User ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    const ratingObj = user.ratings.find(
      (rating) => rating.productId.toString() === productId
    );

    if (ratingObj) {
      const userRating = ratingObj.rating;
      return res.status(200).json({ userRating });
    } else {
      return res.status(404).json({ message: "Rating not found" });
    }
  } catch (error) {
    console.error("Error fetching user rating for product:", error);
    res.status(500).json({ error: "Failed to fetch user rating for product" });
  }
};

export const getUserCountsController = async (req, res) => {
  try {
    const now = new Date();
    const months = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        month: date.toLocaleString("default", { month: "long" }),
        date,
      };
    }).reverse();

    const userCounts = await Promise.all(
      months.map(async ({ date }, i) => {
        const start = new Date(date);
        const end = new Date(date);
        end.setMonth(end.getMonth() + 1);

        const newUsers = await userModel.countDocuments({
          createdAt: { $gte: start, $lt: end },
        });

        return { month: months[i].month, newUsers };
      })
    );

    res.status(200).json(userCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
