import React, { useState, useEffect } from "react";
import "./AdminOrder.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout/AdminLayout";
import NoFilterResult from "../../../assets/No-filter-Results.svg";
import { IoSearchOutline } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { Select } from "antd";
const { Option } = Select;

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("orderId");
  const [searchTerm1, setSearchTerm1] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchSearchOrder = async () => {
      if (!searchTerm) {
        setError("No search term provided.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `${baseUrl}/order/search-order/${searchTerm}`
        );
        setSearchedOrder(response.data.order);
        setNewStatus(response.data.order.status);
      } catch (error) {
        console.error(
          "Error fetching search results:",
          error.response?.data || error.message
        );
        setError(
          error.response?.data?.message || "Failed to fetch order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSearchOrder();
  }, [baseUrl, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/profile/admin/view-order?orderId=${searchTerm1}`);
  };

  const handleUpdateStatus = async (orderId) => {
    try {
      const response = await axios.put(
        `${baseUrl}/order/update-status/${orderId}`,
        { status: newStatus }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        const res = await axios.post(
          `${baseUrl}/order/search-order/${searchTerm}`
        );
        setSearchedOrder(res.data.order);
        setNewStatus(res.data.order.status);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status: " + error.message);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={`Loading...`}>
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="Order-Details">
        <div className="all-orders-top view-products-top order-details-top">
          <div className="view-products-top-left">
            <h2>Order Details</h2>
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
                value={searchTerm1}
                onChange={(e) => setSearchTerm1(e.target.value)}
                placeholder="Enter Order Id..."
                required
                className="admin-all-order-search-input"
              />
            </form>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && (
          <div className="no-filter-result">
            <div className="no-filter-result-container">
              <div className="no-filter-result-img">
                <img src={NoFilterResult} alt="no-filter-result" />
              </div>
              <div className="no-filter-result-title">
                <h4>{error}</h4>
                <p>
                  You may have entered the id incorrect or the order simply
                  don't exist
                </p>
              </div>
            </div>
          </div>
        )}
        {!searchedOrder && !loading && !error && (
          <p>No order of this orderId found.</p>
        )}
        {searchedOrder && !loading && !error && (
          <div className="order-details-bottom">
            <div className="order-details-card">
              <div className="user-order-card-top">
                <div className="user-order-card-top-left">
                  <h3>Order ID: {searchedOrder.orderId}</h3>
                  <p>Order date: {searchedOrder.createdAt}</p>
                </div>
                <div className="user-order-card-top-right">
                  <Select
                    bordered={true}
                    placeholder="Select Product type"
                    size="large"
                    showSearch
                    className="admin-product-category-select"
                    value={newStatus}
                    onChange={(value) => {
                      setNewStatus(value);
                    }}
                    name="type"
                  >
                    <Option value="pending">Pending</Option>
                    <Option value="processing">Processing</Option>
                    <Option value="delivered">Delivered</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                </div>
              </div>
              <div className="user-order-card-mid">
                {searchedOrder.items.map((item) => (
                  <div
                    className="user-order-card-product"
                    key={item.productId._id}
                  >
                    <Link to={`/products/${item.productId.slug}`}>
                      <img
                        src={`${baseUrl}/product/product-photo/${item.productId._id}`}
                        className="sb-product-card-img user-order-card-img"
                        alt={item.productId.name}
                      />
                    </Link>
                    <div className="user-order-card-product-body">
                      <div className="user-order-card-product-title">
                        {item.productId.name}
                      </div>
                      <div className="user-order-product-desc">
                        <h4 className="user-order-product-desc-price">
                          $ {item.productId.price}
                        </h4>
                        <div className="user-order-product-desc-quantity">
                          <p>Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="order-detail-card-total">
                  <strong>Total : $ {searchedOrder.total}</strong>
                </div>
              </div>
              <div className="order-details-card-bottom">
                <div className="order-details-bottom-left">
                  <p>{searchedOrder.userId.name}</p>
                  <p>{searchedOrder.userId.email}</p>
                  <p>{searchedOrder.userId.phone}</p>
                </div>
                <div className="order-details-card-bottom-right">
                  <p>{searchedOrder.address.addressLine1}</p>
                  <p>{searchedOrder.address.addressLine1}</p>
                  <p>
                    {searchedOrder.address.city} ,{" "}
                    {searchedOrder.address.zipcode}
                  </p>
                  <p>{searchedOrder.address.country}</p>
                </div>
              </div>
            </div>
            <div className="user-details-card-button">
              <button
                className="admin-product-submit-btn create-category-btn save-order-btn"
                disabled={
                  newStatus === searchedOrder.status || newStatus === ""
                }
                onClick={() => handleUpdateStatus(searchedOrder._id)}
              >
                Save
              </button>
            </div>
          </div>
        )}
        <Toaster />
      </div>
    </AdminLayout>
  );
};

export default OrderDetails;
