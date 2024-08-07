import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import "./User.css";
import Layout from "../../../components/Layout";
import NoOrder from "../../../assets/no-order.png";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const UserProfile = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchUserRef = useRef(null);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

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
  const ProfileLogo = firstName?.charAt(0);

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
            <img src={NoOrder} alt="No orders" />
          </div>
        </div>
        <Toaster />
      </div>
    </Layout>
  );
};

export default UserProfile;
