import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import "./User.css";
import Layout from "../../../components/Layout";
import NoOrder from "../../../assets/no-order.png";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CancelOrderModel from "../../../modal/CancelOrderModel";

const UserProfile = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const fetchUserRef = useRef(null);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const limit = 5;

  const userDetailsString = useMemo(
    () =>
      localStorage.getItem("userDetails") ||
      sessionStorage.getItem("userDetails"),
    []
  );

  const userDetails = useMemo(
    () => JSON.parse(userDetailsString),
    [userDetailsString]
  );
  const userEmail = userDetails?.email;
  const firstName = userDetail?.name.split(" ")[0];
  const ProfileLogo = firstName ? firstName.charAt(0) : "U";

  fetchUserRef.current = async () => {
    if (userEmail) {
      try {
        const { data } = await axios.get(
          `${baseUrl}/user/user-details/${userEmail}`
        );
        setUserDetail(data.user);
      } catch (error) {
        toast.error("Something went wrong while fetching the user details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userDetails) {
      fetchUserRef.current();
    }
  }, [baseUrl, userEmail, userDetails]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userDetail?._id) return;

      try {
        const response = await axios.get(
          `${baseUrl}/user/get-orders/${userDetail._id}`,
          {
            params: { page, limit },
          }
        );
        const { orders, totalPages } = response.data;
        setOrders(orders);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [baseUrl, userDetail, page]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userDetails");
    navigate("/");
  };

  const handleReset = () => {
    navigate("/auth/reset-password");
  };

  const handleCancelOrder = async () => {
    if (!orderIdToDelete) return;

    try {
      const res = await axios.patch(
        `${baseUrl}/user/cancel-order/${orderIdToDelete}`
      );
      if (res.data.success) {
        toast.success("Order cancelled successfully");
        const response = await axios.get(
          `${baseUrl}/user/get-orders/${userDetail._id}`,
          {
            params: { page, limit },
          }
        );
        const { orders, totalPages } = response.data;
        setOrders(orders);
        setTotalPages(totalPages);
      } else {
        toast.error("Failed to cancel the order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Error cancelling order");
    }
    closeModal();
  };

  const openModal = (orderId) => {
    setIsModalOpen(true);
    setOrderIdToDelete(orderId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!userDetails) {
    return (
      <Layout title={" - LynxLine "}>
        <div className="Profile">
          <div className="profile-title">
            <h1>User details not found!</h1>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout title={`Loading...`}>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout title={`${firstName} - LynxLine`}>
      <div className="Profile">
        <div className="profile-title">
          <h1>Your LynxLine Profile</h1>
        </div>
        <div className="profile-container profile-flex">
          <div className="profile-left profile-side profile-flex">
            <div className="profile-account">
              <div className="pacc-logo">{ProfileLogo}</div>
              <div className="pacc-contents">
                <div className="pacc-name">{userDetail?.name}</div>
                <div className="pacc-email">{userDetail?.email}</div>
                <button onClick={handleReset}>Reset Password</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
          <div className="profile-right profile-side profile-flex">
            <div className="profile-right-title">Your Orders</div>
            {orders.length === 0 ? (
              <img src={NoOrder} alt="No orders" className="no-order" />
            ) : (
              <div className="user-order-section">
                <div className="user-order-container">
                  {orders.map((order) => {
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

                    const OrderStatusColor = getOrderStatusColor(order.status);

                    return (
                      <div className="user-order-card" key={order._id}>
                        <div className="user-order-card-top">
                          <div className="user-order-card-top-left">
                            <h3>Order ID: {order.orderId}</h3>
                            <p>Order date: {order.createdAt}</p>
                          </div>
                          <div className="user-order-card-top-right">
                            <strong
                              className="stock-status"
                              style={{ color: OrderStatusColor }}
                            >
                              {order.status}
                            </strong>
                          </div>
                        </div>
                        <div className="user-order-card-mid">
                          {order.items.map((item) => (
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
                        </div>

                        <div className="user-order-card-bottom">
                          <div className="user-order-card-bottom-left">
                            {order.status === "pending" ? (
                              <button
                                className="admin-product-submit-btn create-category-btn delete-category-btn"
                                onClick={() => openModal(order._id)}
                              >
                                Cancel Order
                              </button>
                            ) : (
                              <div></div>
                            )}
                          </div>
                          <div className="user-order-card-bottom-right">
                            <h4>Total : $ {order.total}</h4>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="user-order-pagination">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
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
              </div>
            )}
          </div>
        </div>
        <CancelOrderModel
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleCancelOrder}
        />
        <Toaster />
      </div>
    </Layout>
  );
};

export default UserProfile;
