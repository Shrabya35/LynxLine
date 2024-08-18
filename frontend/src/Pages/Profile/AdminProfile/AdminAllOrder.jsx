import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrder.css";
import AdminLayout from "./AdminLayout/AdminLayout";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { IoSearchOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa";

const AdminAllOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const limit = 10;

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/order/get-orders`, {
          params: { page, limit },
        });
        if (data?.success) {
          setOrders(data?.orders);
          setTotalPages(data?.totalPages);
        }
      } catch (error) {
        console.error("Error fetching orders :", error);
        toast.error("Error fetching orders:");
      }
    };
    fetchAllOrders();
  }, [baseUrl, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/profile/admin/view-order?orderId=${searchTerm}`);
  };
  const handleView = (searchTerm) => {
    navigate(`/profile/admin/view-order?orderId=${searchTerm}`);
  };
  const getOrderStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffbb33";
      case "processing":
        return "#ffc400";
      case "delivered":
        return "#00d247";
      case "cancelled":
        return "#ff0000";
      default:
        return "#000000";
    }
  };

  return (
    <AdminLayout>
      <div className="All-Orders">
        <div className="all-orders-top view-products-top">
          <div className="view-products-top-left">
            <h2>All Orders</h2>
          </div>
          <div className="view-products-top-right">
            <form className="admin-all-order-search" onSubmit={handleSearch}>
              <IoSearchOutline
                onClick={handleSearch}
                className="nav-mob-search-icon"
              />
              <input
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter Order Id..."
                required
                className="admin-all-order-search-input"
              />
            </form>
          </div>
        </div>
        <div className="all-orders-bottom">
          <table className="custom-table admin-order-table">
            <thead>
              <tr className="custom-table-tr">
                <th>Order Id</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Total</th>
                <th>status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => {
                const OrderStatusColor = getOrderStatusColor(order.status);
                return (
                  <tr key={order._id} className="custom-table-tr">
                    <td>
                      <strong>{order.orderId}</strong>
                    </td>
                    <td>{order.createdAt}</td>
                    <td>{order.userId.name}</td>
                    <td>
                      <p className="all-orders-table-address">
                        {order.address.addressLine1},{" "}
                        {order.address.addressLine2}
                      </p>
                      <p>
                        {order.address.zipcode},{order.address.city},
                        {order.address.country}
                      </p>
                    </td>
                    <td>
                      <strong>$ {order.total}</strong>
                    </td>
                    <td>
                      <strong style={{ color: OrderStatusColor }}>
                        {order.status}
                      </strong>
                    </td>
                    <td className="admin-category-action">
                      <button
                        className="view-order-btn delete-category-btn "
                        onClick={() => handleView(order._id)}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="user-order-pagination all-order-pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
        <Toaster />
      </div>
    </AdminLayout>
  );
};

export default AdminAllOrder;
