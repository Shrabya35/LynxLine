import fs from "fs";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import slugify from "slugify";

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      type,
      description,
      price,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { image } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !type:
        return res.status(500).send({ error: "type is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case image:
        return res.status(500).send({ error: "image is required " });
      case image.size > 1000000:
        return res
          .status(500)
          .send({ error: "image's size should be smaller than 1 mb" });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (image) {
      products.image.data = fs.readFileSync(image.path);
      products.image.contentType = image.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Products Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Creating Product ",
      error,
    });
  }
};
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-image")
      .sort({ createdt: -1 });
    res.status(201).send({
      success: true,
      message: "All Products ",
      totalCounts: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Product",
      error,
    });
  }
};

export const singleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category")
      .select("-image");

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single Product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting single product",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const products = await productModel
      .findById(req.params.pid)
      .select("image");
    if (products.image.data) {
      res.set("Content-type", products.image.contentType);
      return res.status(200).send(products.image.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Product's product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      type,
      description,
      price,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { image } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !type:
        return res.status(500).send({ error: "Type is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !price:
        return res.status(500).send({ error: "Price is required" });
      case !category:
        return res.status(500).send({ error: "Category is required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });
      case image && !image.size:
        return res.status(500).send({ error: "Image is required" });
      case image && image.size > 1000000:
        return res
          .status(500)
          .send({ error: "Image's size should be smaller than 1 MB" });
    }

    let shippingValue;
    if (shipping === "Not Specified") {
      shippingValue = undefined; 
    } else {
      shippingValue = shipping === "true" || shipping === "1" ? true : false;
    }

    const updateFields = {
      name,
      slug: slugify(name),
      type,
      description,
      price,
      category,
      quantity,
      ...(shippingValue !== undefined && { shipping: shippingValue }),
    };

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      updateFields,
      { new: true }
    );

    if (image) {
      product.image.data = fs.readFileSync(image.path);
      product.image.contentType = image.type;
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-image");
    res.status(201).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Deleting product",
      error,
    });
  }
};

export const getPaginatedProductsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const products = await productModel
      .find({})
      .populate("category")
      .select("-image")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await productModel.countDocuments();

    res.status(200).send({
      success: true,
      message: "Paginated Products fetched successfully",
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching paginated products",
      error,
    });
  }
};

export const searchProductController = async (req, res) => {
  const searchTerm = req.params.search || "";
  const searchRegex = searchTerm
    .split(" ")
    .map((term) => new RegExp(`\\b${term}\\b`, "i"));

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  try {
    const query = {
      $or: [
        { $or: searchRegex.map((regex) => ({ name: { $regex: regex } })) },
        {
          $or: searchRegex.map((regex) => ({
            type: { $regex: regex },
          })),
        },
      ],
    };

    const results = await productModel
      .find(query)
      .populate("category")
      .select("-image")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await productModel.countDocuments(query);

    res.status(200).send({
      success: true,
      message: "Paginated Products fetched successfully",
      total,
      page,
      pages: Math.ceil(total / limit),
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Search",
      error,
    });
  }
};

export const addRatingController = async (req, res) => {
  const { productId, rating, userId } = req.body;

  try {
    const existingUserRating = await userModel.findOne({
      _id: userId,
      "ratings.productId": productId,
    });

    if (existingUserRating) {
      const updateResult = await userModel.updateOne(
        { _id: userId, "ratings.productId": productId },
        { $set: { "ratings.$.rating": rating } }
      );

      if (updateResult.matchedCount === 0) {
        console.error("No matching user rating found for update.");
      }
    } else {
      console.log("Adding new user rating for product", productId);
      await userModel.findByIdAndUpdate(userId, {
        $push: { ratings: { productId, rating } },
      });
    }

    const existingProductRating = await productModel.findOne({
      _id: productId,
      "ratings.user": userId,
    });

    if (existingProductRating) {
      console.log("Updating product rating for user", userId);
      const updateResult = await productModel.updateOne(
        { _id: productId, "ratings.user": userId },
        { $set: { "ratings.$.rating": rating } }
      );

      if (updateResult.matchedCount === 0) {
        console.error("No matching product rating found for update.");
      }
    } else {
      console.log("Adding new product rating for user", userId);
      await productModel.findByIdAndUpdate(productId, {
        $push: { ratings: { user: userId, rating } },
      });
    }

    res.status(200).json({ message: "Rating added successfully" });
  } catch (error) {
    console.error("Error adding/updating rating:", error);
    res.status(500).json({ error: "Failed to add/update rating" });
  }
};

export const getProductRatingsController = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await productModel
      .findById(productId)
      .populate("ratings.user");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalRatings = product.ratings.length;

    let oneStar = 0,
      twoStar = 0,
      threeStar = 0,
      fourStar = 0,
      fiveStar = 0;
    let sumWeightedRatings = 0;

    product.ratings.forEach((rating) => {
      switch (rating.rating) {
        case 1:
          oneStar++;
          break;
        case 2:
          twoStar++;
          break;
        case 3:
          threeStar++;
          break;
        case 4:
          fourStar++;
          break;
        case 5:
          fiveStar++;
          break;
      }
      sumWeightedRatings += rating.rating;
    });

    const averageRating =
      totalRatings > 0 ? sumWeightedRatings / totalRatings : 0;

    res.status(200).json({
      averageRating,
      totalRatings,
      oneStar,
      twoStar,
      threeStar,
      fourStar,
      fiveStar,
    });
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    res.status(500).json({ error: "Failed to fetch product ratings" });
  }
};
