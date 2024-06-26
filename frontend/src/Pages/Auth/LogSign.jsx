import React, { useState } from "react";
import "./LogSign.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { GoEye, GoEyeClosed } from "react-icons/go";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post(`${baseUrl}/auth/register`, {
        name,
        email,
        password,
        phone,
      })
      .then((response) => {
        const { success, message } = response.data;
        console.log(message);
        if (success) {
          toast.success(message);

          setName("");
          setEmail("");
          setPassword("");
          setPhone("");
        } else {
          toast.error(message);
        }
      })
      .catch((err) => toast.error(err));
  };
  return (
    <div className="signup">
      <form onSubmit={handleSubmit} action="POST">
        <label htmlFor="chk" aria-hidden="true">
          Register
        </label>
        <input
          className="auth-input"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          className="auth-input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="auth-input"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          className="auth-input"
          type="number"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone no."
          required
        />
        <button type="submit" className="sign-up-btn auth-btn">
          Register
        </button>
      </form>
    </div>
  );
};

const LogInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email,
        password,
      });

      const { success, message, token, user } = response.data;
      const userDetails = {
        name: user.name,
        email: user.email,
        phone: user.phone,
      };

      console.log(message);
      if (success) {
        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("userDetails", JSON.stringify(userDetails));
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
        }
        toast.success(message);
        navigate("/profile/user");
      } else {
        toast.error(message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userDetails");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userDetails");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error("An error occurred:", error);
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} action="POST">
        <label htmlFor="chk" aria-hidden="true">
          Login
        </label>
        <input
          className="auth-input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <div className="password-input">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <span className="password-toggle-icon" onClick={handleTogglePassword}>
            {showPassword ? <GoEye /> : <GoEyeClosed />}
          </span>
        </div>
        <div className="login-attribute">
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember-me"
              name="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span htmlFor="remember-me">Remember me</span>
          </div>
          <a href="/auth/forgot-password" className="forgot-password">
            Forgot Password?
          </a>
        </div>
        <button type="submit" className="login-btn auth-btn">
          Login
        </button>
      </form>
    </div>
  );
};

const LogSign = () => {
  return (
    <div className="main">
      <input type="checkbox" id="chk" aria-hidden="true" />
      <SignUpForm />
      <LogInForm />
    </div>
  );
};

export default LogSign;
