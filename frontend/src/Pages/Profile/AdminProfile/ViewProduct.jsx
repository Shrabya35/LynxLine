import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminManage.css";
import AdminLayout from "./AdminLayout/AdminLayout";
import { Link } from "react-router-dom";

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async (page) => {
    try {
      const response = await axios.get(
        `http://192.168.1.10:9080/api/v1/product/paginated-products?page=${page}&limit=9`
      );
      setProducts(response.data.products);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

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
        <div className="view-products-container">
          <div className="admin-products-section whishlist-card-container">
            {products.map((p) => (
              <Link to={`/profile/admin/product/${p.slug}`} key={p._id}>
                <div className="product-card admin-product-card">
                  <img
                    src={`http://192.168.1.10:9080/api/v1/product/product-photo/${p._id}`}
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
