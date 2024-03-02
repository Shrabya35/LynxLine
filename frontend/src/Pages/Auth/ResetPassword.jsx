import React, { useState } from "react";
import "./ResetPassword.css";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9080/api/v1/auth/reset-password",
        {
          email,
          password,
          newPassword,
        }
      );

      const { success, message } = response.data;
      if (success) {
        toast.success(message);
        navigate("/auth");
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Email or Password did not matched");
    }
  };

  return (
    <Layout title={"Reset Password - LynxLine Account"}>
      <div className="Forgot-Password">
        <Toaster />
        <div className="fp-container">
          <form onSubmit={handleSubmit} className="fp-content" action="POST">
            <h1 className="fp-title">Reset Your Password</h1>
            <input
              className="fp-input"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />

            <input
              className="fp-input"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Old Password"
              required
            />

            <input
              className="fp-input"
              type="text"
              name="newpassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
            />
            <a href="/auth/reset-password" className="forgot-password">
              Forgot Password?
            </a>

            <button type="submit" className="fp-btn">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
