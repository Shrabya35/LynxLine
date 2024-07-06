import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminManage.css";
import AdminLayout from "./AdminLayout/AdminLayout";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MdOutlineAddShoppingCart } from "react-icons/md";

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async (page) => {
      try {
        const response = await axios.get(
          `${baseUrl}product/paginated-products?page=${page}&limit=9`
        );
        setProducts(response.data.products);
        setTotalPages(response.data.pages);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts(page);
  }, [baseUrl, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === page ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <AdminLayout title={`View Products - LynxLine`}>
      <div className="View-Products">
        <Toaster />
        <div className="view-products-top">
          <div className="view-products-top-left">
            <h2>Products</h2>
          </div>
          <div className="view-products-top-right">
            <a
              href="/profile/admin/add-product"
              className="view-products-top-add-category create-category-btn"
            >
              Create
              <MdOutlineAddShoppingCart />
            </a>
          </div>
        </div>
        <div className="view-products-container">
          <div className="admin-products-section whishlist-card-container">
            {products.map((p) => (
              <Link to={`/profile/admin/product/${p.slug}`} key={p._id}>
                <div className="product-card admin-product-card">
                  <img
                    src={`${baseUrl}/product/product-photo/${p._id}`}
                    className="product-card-img"
                    alt={p.name}
                  />
                  <div className="product-card-body">
                    <div className="product-card-title">{p.name}</div>
                    <div className="product-card-desc">
                      <div className="product-card-category">
                        {p.category.name}
                      </div>
                      <div className="product-card-type">{p.type}</div>
                      <h4 className="product-card-price">${p.price}</h4>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="pagination-container">{renderPagination()}</div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewProduct;
