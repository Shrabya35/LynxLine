import userModel from "../models/userModel.js";

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
