import React, { useState, useEffect } from "react";
import "./adminManage.css";
import AdminLayout from "./AdminLayout/AdminLayout";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import ConfirmModal from "./modal/ConfirmModal";
import UpdateModal from "./modal/UpdateModal";

const CreateCategory = () => {
  const [category, setCategory] = useState([]);
  const [name, setName] = useState("");
  const [categoryForm, setCategoryForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);

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
      if (data.success) {
        setCategory(data.category);
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleNew = () => {
    setCategoryForm(!categoryForm);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://192.168.1.10:9080/api/v1/category/create-category",
        { name }
      );

      const { success, message, category: newCategory } = response.data;

      if (success) {
        toast.success(message);
        setCategory((prevCategories) => [...prevCategories, newCategory]);
        setName("");
        setCategoryForm(false);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  const openModal = (categoryId) => {
    setIsModalOpen(true);
    setCategoryIdToDelete(categoryId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteCategory = async () => {
    if (!categoryIdToDelete) return;

    try {
      const response = await axios.delete(
        `http://192.168.1.10:9080/api/v1/category/delete-category/${categoryIdToDelete}`
      );

      const { success, message } = response.data;

      if (success) {
        setCategory((prevCategories) =>
          prevCategories.filter(
            (category) => category._id !== categoryIdToDelete
          )
        );
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Failed to delete category");
    }

    closeModal();
  };

  const openUpdateModal = (category) => {
    setCategoryToUpdate(category);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleUpdateCategory = async (newName) => {
    if (!newName) return;

    try {
      const response = await axios.put(
        `http://192.168.1.10:9080/api/v1/category/update-category/${categoryToUpdate._id}`,
        { name: newName }
      );

      const { success, message, category: updatedCategory } = response.data;

      if (success) {
        setCategory((prevCategories) =>
          prevCategories.map((category) =>
            category._id === updatedCategory._id ? updatedCategory : category
          )
        );
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating the category");
    }

    closeUpdateModal();
  };

  return (
    <AdminLayout title={`${firstName} | Category - LynxLine`}>
      <div className="Admin-Category">
        <Toaster />
        <div className="category-title">
          <h2>Manage Category</h2>
          <div className="admin-new-category">
            <button onClick={handleNew}>New</button>
          </div>
        </div>
        <form
          className="admin-category-form"
          style={{
            display: categoryForm ? "flex" : "none",
          }}
          onSubmit={handleCreateCategory}
          action="POST"
        >
          <input
            className="admin-category-input"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            required
          />
          <button type="submit" className="create-category-btn">
            Create
          </button>
        </form>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {category?.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td className="admin-category-action">
                  <button
                    className="edit-category-btn"
                    onClick={() => openUpdateModal(c)}
                  >
                    Edit
                  </button>
                  <button
                    className=" delete-category-btn"
                    onClick={() => openModal(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleDeleteCategory}
        />
        <UpdateModal
          isOpen={isUpdateModalOpen}
          onClose={closeUpdateModal}
          onUpdate={handleUpdateCategory}
          category={categoryToUpdate}
        />
      </div>
    </AdminLayout>
  );
};

export default CreateCategory;
