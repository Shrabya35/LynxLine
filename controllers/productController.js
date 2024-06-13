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
      shippingValue = undefined; //
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
