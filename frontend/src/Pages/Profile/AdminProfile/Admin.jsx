import React from "react";
import { useNavigate } from "react-router-dom";
import "../UserProfile/User.css";
import "./Admin.css";
import AdminLayout from "./AdminLayout/AdminLayout";

import { BiSolidCategory } from "react-icons/bi";
import {
  MdOutlineProductionQuantityLimits,
  MdAddShoppingCart,
} from "react-icons/md";
import { IoIosCreate } from "react-icons/io";

const AdminProfile = () => {
  const navigate = useNavigate();
  const userDetailsString =
    localStorage.getItem("userDetails") ||
    sessionStorage.getItem("userDetails");

  const userDetails = JSON.parse(userDetailsString);
  const firstName = userDetails?.name.split(" ")[0];
  const ProfileLogo = firstName?.charAt(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userDetails");

    navigate("/");
  };
  const handleProduct = () => {
    navigate("/profile/admin/product");
  };
  const handleCategory = () => {
    navigate("/profile/admin/category");
  };

  if (!userDetails) {
    return (
      <AdminLayout title={" - LynxLine "}>
        <div className="Profile">
          <div className="profile-title">
            <h1>Details not found!</h1>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`${firstName} - LynxLine`}>
      <div className="Profile Admin-profile profile-side">
        <div className="admin-top profile-flex profile-side admin-side">
          <div className="admin-top-contents">
            <div className="profile-account">
              <div className="pacc-logo">{ProfileLogo}</div>
              <div className="pacc-contents">
                <div className="pacc-name">{userDetails.name}</div>
                <div className="pacc-email">{userDetails.email}</div>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
          <div className="admin-top-contents">
            <div className="profile-account">
              <div className="pacc-logo">
                <BiSolidCategory />
              </div>
              <div className="pacc-contents">
                <div className="pacc-name">Create Categories</div>
                <div className="pacc-email">Details of new category</div>
                <button onClick={handleCategory}>
                  <IoIosCreate />
                  Create
                </button>
              </div>
            </div>
          </div>
          <div className="admin-top-contents">
            <div className="profile-account">
              <div className="pacc-logo">
                <MdOutlineProductionQuantityLimits />
              </div>
              <div className="pacc-contents">
                <div className="pacc-name">Add Products</div>
                <div className="pacc-email">Add new product for sale</div>
                <button onClick={handleProduct}>
                  <MdAddShoppingCart />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
