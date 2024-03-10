import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "./AdminLayout.css";

import NavLogo from "../../../../assets/logo.png";
import { MdDashboard, MdSupervisedUserCircle } from "react-icons/md";
import { FaTachometerAlt } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { FaTags } from "react-icons/fa6";

const AdminLayout = ({ children, title, description, keywords, author }) => {
  const [showDropdown, setShowDropdown] = useState(false);

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
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="admin-layout">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta charSet="utf-8" />
        <title> {title} </title>
      </Helmet>
      <main className="admin-nav admin-flex">
        <nav className="admin-nav1">
          <ul>
            <li className="admin-logo">
              <a href="/">
                <img src={NavLogo} alt="" />
                <h2 className="logo-name">LynxLine</h2>
              </a>
            </li>
            <li className="admin-profile-mob" onClick={toggleDropdown}>
              <span className=" admin-profile-icon">{ProfileLogo}</span>
              {showDropdown && (
                <div className="dropdown">
                  <span>
                    <IoLogOut className="admin-icon" onClick={handleLogout} />
                  </span>
                </div>
              )}
            </li>
          </ul>
        </nav>
        <nav className="admin-sec-nav admin-flex">
          <div className="admin-main-nav admin-flex">
            <a href="/profile/admin" className="admin-nav-items">
              <FaTachometerAlt className="admin-icon" />
              <span> Dashboard</span>
            </a>
            <a href="/profile/admin/product" className="admin-nav-items">
              <FaTags className="admin-icon" />
              <span> Products</span>
            </a>
            <a href="/profile/admin/category" className="admin-nav-items ">
              <MdDashboard className="admin-icon" />
              <span> Category</span>
            </a>
            <a href="/" className="admin-nav-items">
              <MdSupervisedUserCircle className="admin-icon" />
              <span> Users</span>
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

      <main className="admin-main">{children}</main>
    </div>
  );
};

AdminLayout.defaultProps = {
  title: "LynxLine - Unleash Your Inner Beast",
  description: "Official Store of LynxLine",
  keywords: "LynxLine,Sports wear, gym wears",
  author: "LynxLine CO.",
};

export default AdminLayout;
