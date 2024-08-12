import React, { useState, useEffect, useMemo } from "react";
import "./AdminDashboard.css";
import AdminLayout from "./AdminLayout/AdminLayout";
import {
  BsClipboardFill,
  BsFillClipboardDataFill,
  BsFillClipboard2CheckFill,
  BsFillClipboard2XFill,
} from "react-icons/bs";
import axios from "axios";
import OrderStatusPie from "./Graphs/OrderStatusPie";
import LineGraph from "./Graphs/LineGraph";

const AdminDashboard = () => {
  const [pending, setpending] = useState("");
  const [processing, setProcessing] = useState("");
  const [delivered, setDelivered] = useState("");
  const [cancelled, setCancelled] = useState("");
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const countOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/order/count-orders`);
        const {
          pendingOrders,
          processingOrders,
          deliveredOrders,
          cancelledOrders,
        } = response.data;
        setpending(pendingOrders);
        setProcessing(processingOrders);
        setDelivered(deliveredOrders);
        setCancelled(cancelledOrders);
      } catch (error) {
        console.error("Error Counting orders:", error);
      }
    };

    countOrders();
  }, [baseUrl]);

  const userDetailsString = useMemo(
    () =>
      localStorage.getItem("userDetails") ||
      sessionStorage.getItem("userDetails"),
    []
  );

  const userDetails = JSON.parse(userDetailsString);
  const firstName = userDetails?.name.split(" ")[0];

  return (
    <AdminLayout title={`${firstName}'s Dashboard | Admin - LynxLine`}>
      <div className="Admin-Dashboard">
        <div className="admin-dashboard-top">
          <h2>Dashboard</h2>
        </div>
        <div className="admin-dashboard-container">
          <div className="admin-dashboard-order-data admin-dashboard-section">
            <div className="admin-dashboard-order-data-section">
              <div className="admin-dashboard-order-data-card admin-dashboard-order-data-card-total">
                <div className="adodc-left">
                  <div className="abodc-left-top">Pending</div>
                  <div className="abodc-left-bottom">{pending}</div>
                </div>
                <div className="adodc-right">
                  <BsClipboardFill className="abodc-right-icon" />
                </div>
              </div>
              <div className="admin-dashboard-order-data-card admin-dashboard-order-data-card-packaging">
                <div className="adodc-left">
                  <div className="abodc-left-top">Processing</div>
                  <div className="abodc-left-bottom">{processing}</div>
                </div>
                <div className="adodc-right">
                  <BsFillClipboardDataFill className="abodc-right-icon" />
                </div>
              </div>
              <div className="admin-dashboard-order-data-card admin-dashboard-order-data-card-delivered">
                <div className="adodc-left">
                  <div className="abodc-left-top">Delivered</div>
                  <div className="abodc-left-bottom">{delivered}</div>
                </div>
                <div className="adodc-right">
                  <BsFillClipboard2CheckFill className="abodc-right-icon" />
                </div>
              </div>
              <div className="admin-dashboard-order-data-card admin-dashboard-order-data-card-cancelled">
                <div className="adodc-left">
                  <div className="abodc-left-top">Cancelled</div>
                  <div className="abodc-left-bottom">{cancelled}</div>
                </div>
                <div className="adodc-right">
                  <BsFillClipboard2XFill className="abodc-right-icon" />
                </div>
              </div>
            </div>
          </div>
          <div className="admin-dashboard-graph admin-dashboard-section">
            <div className="admin-dashboard-graph-left">
              <h3>User Statistics (5 months)</h3>
              <LineGraph />
            </div>

            <div className="admin-dashboard-graph-right">
              <h3>Order Status</h3>
              <OrderStatusPie />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
