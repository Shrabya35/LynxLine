import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout/AdminLayout";
import "./adminManage.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Select } from "antd";
const { Option } = Select;

const AddProduct = () => {
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(0);
  const [image, setImage] = useState("");
  const baseUrl = window.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/category/get-category`);
        if (data?.success) {
          setFetchedCategories(data?.category);
        }
      } catch (error) {
        console.log("Something Went Wrong");
        toast.error("Something Went Wrong");
      }
    };
    getAllCategories();
  }, [baseUrl]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {
      const selectedCategoryObject = fetchedCategories.find(
        (category) => category.name === selectedCategory
      );
      const selectedCategoryId = selectedCategoryObject
        ? selectedCategoryObject._id
        : null;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", selectedCategoryId);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("shipping", shipping);
      formData.append("image", image);

      const response = await axios.post(
        `${baseUrl}/product/create-product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { success, message, error } = response.data;

      if (success) {
        toast.success(message);
        setName("");
        setDescription("");
        setSelectedCategory("");
        setImage(null);
        setPrice("");
        setType("");
        setQuantity("");
        setShipping(0);
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <AdminLayout title={`Add Product - LynxLine`}>
      <div className="Admin-Category Admin-product">
        <Toaster />
        <div className="category-title product-title">
          <h2>Add Product</h2>
        </div>
        <form
          className="admin-category-form admin-product-form"
          action="POST"
          onSubmit={handleCreateProduct}
        >
          <div className="admin-product-form-1">
            <input
              className="admin-category-input admin-product-input"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              required
            />
            <Select
              bordered={true}
              placeholder="Select a category"
              size="large"
              showSearch
              className="admin-product-category-select"
              onChange={(value) => {
                setSelectedCategory(value);
              }}
              name="category"
            >
              {Array.isArray(fetchedCategories) &&
                fetchedCategories.map((c) => (
                  <Option key={c._id} value={c.name}>
                    {c.name}
                  </Option>
                ))}
            </Select>
          </div>
          <div className="admin-product-form-2">
            <label htmlFor="upload" className="admin-img-upload-btn">
              {image ? image.name : "Upload Photo"}
              <input
                id="upload"
                type="file"
                name="image"
                accept="image/*"
                className="upload-hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>
          <div className="admin-product-form-3">
            {image && (
              <div className="admin-product-preview">
                <img src={URL.createObjectURL(image)} alt="Product preview" />
              </div>
            )}
          </div>
          <div className=" admin-product-form-4">
            <textarea
              className="admin-product-textarea"
              placeholder=" Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              cols="50"
            ></textarea>
          </div>
          <div className="admin-product-form-5">
            <Select
              bordered={true}
              placeholder="Select Product type"
              size="large"
              showSearch
              className="admin-product-category-select"
              onChange={(value) => {
                setType(value);
              }}
              name="type"
            >
              <Option value="Men">Men</Option>
              <Option value="Women">Women</Option>
              <Option value="Accessories">Accessories</Option>
            </Select>
            <input
              className="admin-category-input admin-product-short-input"
              type="number"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              required
            />
          </div>
          <div className="admin-product-form-6 admin-product-form-5">
            <Select
              bordered={true}
              placeholder="Shipping "
              size="large"
              showSearch
              className="admin-product-category-select"
              onChange={(value) => {
                setShipping(value);
              }}
              name="shipping"
            >
              <Option value="1">Yes</Option>
              <Option value="0">No</Option>
            </Select>
            <input
              className="admin-category-input admin-product-short-input"
              type="number"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              required
            />
          </div>
          <div className="admin-product-submit">
            <button
              type="submit"
              className="admin-product-submit-btn create-category-btn"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;
