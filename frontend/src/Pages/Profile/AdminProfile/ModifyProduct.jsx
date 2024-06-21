import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout/AdminLayout";
import ConfirmModal from "../../../modal/ConfirmModal";
import "./adminManage.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Select } from "antd";
const { Option } = Select;

const ModifyProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productData, setProductData] = useState({});
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(0);
  const [image, setImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const userDetailsString =
    localStorage.getItem("userDetails") ||
    sessionStorage.getItem("userDetails");
  const userDetails = JSON.parse(userDetailsString);
  const firstName = userDetails?.name.split(" ")[0];

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://192.168.1.10:9080/api/v1/category/get-category"
      );
      if (data?.success) {
        setFetchedCategories(data?.category);
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `http://192.168.1.10:9080/api/v1/product/single-product/${slug}`
      );
      setProductData(data.product);
      setName(data.product.name);
      setType(data.product.type);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping || "Shipping");
      setSelectedCategory(data.product.category.name);

      const imageResponse = await axios.get(
        `http://192.168.1.10:9080/api/v1/product/product-photo/${data.product._id}`,
        { responseType: "blob" }
      );
      setImage(URL.createObjectURL(imageResponse.data));
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong while fetching the product");
      console.error(error);
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateProduct = async (e) => {
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
      if (image instanceof File) {
        formData.append("image", image);
      }

      const response = await axios.put(
        `http://192.168.1.10:9080/api/v1/product/update-product/${productData._id}`,
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
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const openModal = (productId) => {
    setIsModalOpen(true);
    setProductIdToDelete(productId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteProduct = async () => {
    if (!productIdToDelete) return;

    try {
      const response = await axios.delete(
        `http://192.168.1.10:9080/api/v1/product/delete-product/${productIdToDelete}`
      );

      const { success, message } = response.data;

      if (success) {
        toast.success(message);
        navigate("/profile/admin/view-products");
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Failed to delete Product");
    }

    closeModal();
  };

  if (loading) {
    return (
      <AdminLayout title={`Loading...`}>
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`${firstName} | Product - LynxLine`}>
      <div className="Admin-Category Admin-product">
        <Toaster />
        <div className="category-title product-title">
          <h2>Edit Product</h2>
        </div>
        <form
          className="admin-category-form admin-product-form"
          action="POST"
          onSubmit={handleUpdateProduct}
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
              value={selectedCategory}
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
              {image instanceof File ? image.name : "Upload Photo"}
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
                <img
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
                  alt="Product preview"
                />
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
              value={type}
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
              placeholder="Shipping"
              size="large"
              showSearch
              className="admin-product-category-select"
              value={shipping}
              onChange={(value) => {
                setShipping(
                  value === "1" ? true : value === "0" ? false : "Not Specified"
                );
              }}
              name="shipping"
            >
              <Option value="1">Yes</Option>
              <Option value="0">No</Option>
              <Option value="Not Specified">Not Specified</Option>
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
          <div className="admin-update-product-btn admin-product-submit">
            <button
              type="submit"
              className="admin-product-submit-btn create-category-btn edit-category-btn"
            >
              Update Product
            </button>
            <button
              className="admin-product-submit-btn create-category-btn delete-category-btn"
              onClick={(e) => {
                e.preventDefault();
                openModal(productData._id);
              }}
            >
              Delete Product
            </button>
          </div>
        </form>
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleDeleteProduct}
        />
      </div>
    </AdminLayout>
  );
};

export default ModifyProduct;
