import React from "react";
import { useNavigate } from "react-router-dom";
import NavLogo from "../../../../assets/logo.png";
import "./AdminLayout.css";
import { MdDashboard, MdShoppingCart } from "react-icons/md";
import { FaTachometerAlt, FaClipboardList } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

const AdminNav = () => {
  const OrderDropdownMenu = (
    <Menu className="custom-dropdown-menu-order">
      <Menu.Item key="1">
        <a href="/profile/admin/all-orders">All Orders</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="/profile/admin/pending-orders">Pending</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="/profile/admin/processing-orders">Processing</a>
      </Menu.Item>
      <Menu.Item key="4">
        <a href="/profile/admin/delivered-orders">Delivered</a>
      </Menu.Item>
      <Menu.Item key="5">
        <a href="/profile/admin/cancelled-orders">Cancelled</a>
      </Menu.Item>
    </Menu>
  );

  const userDetailsString =
    localStorage.getItem("userDetails") ||
    sessionStorage.getItem("userDetails");

  const userDetails = JSON.parse(userDetailsString);
  const firstName = userDetails?.name.split(" ")[0];
  const ProfileLogo = firstName?.charAt(0);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userDetails");

    navigate("/");
  };
  const LogoutDropdownMenu = (
    <Menu className="custom-dropdown-menu-logout">
      <Menu.Item key="1">
        <IoLogOut className="admin-icon" onClick={handleLogout} />
      </Menu.Item>
    </Menu>
  );
  return (
    <main className="admin-nav admin-flex">
      <nav className="admin-nav1">
        <ul>
          <li className="admin-logo">
            <a href="/">
              <img src={NavLogo} alt="" />
              <h2 className="logo-name">LynxLine</h2>
            </a>
          </li>
          <Dropdown overlay={LogoutDropdownMenu} className="admin-profile-mob">
            <span className=" admin-profile-icon">{ProfileLogo}</span>
          </Dropdown>
        </ul>
      </nav>
      <nav className="admin-sec-nav admin-flex">
        <div className="admin-main-nav admin-flex">
          <a href="/profile/admin" className="admin-nav-items">
            <FaTachometerAlt className="admin-icon" />
            <span> Dashboard</span>
          </a>

          <Dropdown overlay={OrderDropdownMenu}>
            <div className="admin-nav-items">
              <FaClipboardList className="admin-icon" />
              <span>
                Orders <DownOutlined />
              </span>
            </div>
          </Dropdown>
          <a href="/profile/admin/category" className="admin-nav-items ">
            <MdDashboard className="admin-icon" />
            <span> Category</span>
          </a>
          <a href="/profile/admin/view-products" className="admin-nav-items">
            <MdShoppingCart className="admin-icon" />
            <span>View Products</span>
          </a>
        </div>
      </nav>
      <div className="admin-profile">
        <div className="admin-profile-side1">
          <div className="admin-profile-icon">{ProfileLogo}</div>
          <div className="admin-profile-name">{firstName}</div>
        </div>
        <div className="admin-profile-side2">
          <IoLogOut className="admin-icon" onClick={handleLogout} />
        </div>
      </div>
    </main>
  );
};

export default AdminNav;
