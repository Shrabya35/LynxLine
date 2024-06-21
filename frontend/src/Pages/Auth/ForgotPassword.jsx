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
  const [gototp, setGototp] = useState(false);
  const navigate = useNavigate();
  const baseUrl = window.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post(`${baseUrl}/auth/forgot-password`, {
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
      const response = await axios.post(`${baseUrl}/auth/generate-otp`, {
        email,
      });
      const { success, message } = response.data;

      if (success) {
        toast.success(message);
        setGototp(true);
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
  const sendAgain = () => {
    setGototp(false);
  };

  return (
    <Layout title={"Reset Password - LynxLine Account"}>
      <div className="Reset-Password">
        <Toaster />
        <div className="rp-container">
          <form onSubmit={handleSubmit} className="rp-content" action="POST">
            <h1 className="rp-title">Change Your Password</h1>
            <div
              className="fp-email"
              style={{
                display: gototp ? "none" : "block",
              }}
            >
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
            <div
              className="fp-gototp"
              style={{
                display: gototp ? "block" : "none",
              }}
            >
              <div className="fp-otp">
                <input
                  className="rp-input fp-otp"
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
                  className="rp-input rp-password"
                  type="password"
                  name="newpassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                />
              </div>

              <button type="submit" className="rp-btn fp-submit">
                Change Password
              </button>
              <p onClick={sendAgain} className="forgot-password">
                Send Again?
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
