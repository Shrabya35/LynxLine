import React, { useState } from "react";
import "./ResetPassword.css";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:9080/api/v1/auth/forgot-password", {
        email,
        otp,
        newPassword,
      })
      .then((response) => {
        const { success, message } = response.data;

        if (success) {
          toast.success(message);
          navigate("/auth");
        } else {
          toast.error(message);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleGenerateOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9080/api/v1/auth/generate-otp",
        { email }
      );
      const { success, message } = response.data;

      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Email is not registered");
      } else {
        toast.error("Failed to generate OTP");
      }
    }
  };

  return (
    <Layout title={"Reset Password - LynxLine Account"}>
      <div className="Reset-Password">
        <Toaster />
        <div className="rp-container">
          <form onSubmit={handleSubmit} className="rp-content" action="POST">
            <h1 className="rp-title">Change Your Password</h1>
            <div className="fp-email">
              <input
                className="rp-input"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <button className="rp-btn fp-btn" onClick={handleGenerateOTP}>
                Request OTP
              </button>
            </div>

            <div className="fp-otp">
              <input
                className="rp-input"
                inputMode="number"
                type="number"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
            </div>

            <div className="fp-password">
              <input
                className="rp-input"
                type="password"
                name="newpassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
              />
            </div>

            <button type="submit" className="rp-btn">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
