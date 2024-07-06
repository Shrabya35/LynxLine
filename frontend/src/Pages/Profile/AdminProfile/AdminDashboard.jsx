import React, { useMemo } from "react";
import "./AdminDashboard.css";
import AdminLayout from "./AdminLayout/AdminLayout";
import {
  BsClipboardFill,
  BsFillClipboardDataFill,
  BsFillClipboard2CheckFill,
  BsFillClipboard2XFill,
} from "react-icons/bs";

import OrderStatusPie from "./Graphs/OrderStatusPie";
import LineGraph from "./Graphs/LineGraph";

const AdminDashboard = () => {
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
                  <div className="abodc-left-top">Total Orders</div>
                  <div className="abodc-left-bottom">7</div>
                </div>
                <div className="adodc-right">
                  <BsClipboardFill className="abodc-right-icon" />
                </div>
              </div>
              <div className="admin-dashboard-order-data-card admin-dashboard-order-data-card-packaging">
                <div className="adodc-left">
                  <div className="abodc-left-top">In Progress</div>
                  <div className="abodc-left-bottom">4</div>
                </div>
                <div className="adodc-right">
                  <BsFillClipboardDataFill className="abodc-right-icon" />
                </div>
              </div>
              <div className="admin-dashboard-order-data-card admin-dashboard-order-data-card-delivered">
                <div className="adodc-left">
                  <div className="abodc-left-top">Delivered</div>
                  <div className="abodc-left-bottom">2</div>
                </div>
                <div className="adodc-right">
                  <BsFillClipboard2CheckFill className="abodc-right-icon" />
                </div>
              </div>
              <div className="admin-dashboard-order-data-card admin-dashboard-order-data-card-cancelled">
                <div className="adodc-left">
                  <div className="abodc-left-top">Cancelled</div>
                  <div className="abodc-left-bottom">1</div>
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
