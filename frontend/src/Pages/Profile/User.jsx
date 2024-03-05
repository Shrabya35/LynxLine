import React from "react";
import "./User.css";
import Layout from "../../components/Layout";
import NoOrder from "../../assets/no-order.png";

const UserProfile = () => {
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

    window.location.href = "/";
  };
  const handleReset = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userDetails");

    window.location.href = "auth/reset-password";
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
                <div className="pacc-name">{userDetails.name}</div>
                <div className="pacc-email">{userDetails.email}</div>
                <button onClick={handleReset}>Reset Password</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
          <div className="profile-right profile-side profile-flex">
            <div className="profile-right-title">Your Orders</div>
            <img src={NoOrder} alt="" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
