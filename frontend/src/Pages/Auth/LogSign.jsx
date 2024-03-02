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

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:9080/api/v1/auth/register", {
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
      .catch((err) => console.log(err));
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

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:9080/api/v1/auth/login", {
        email,
        password,
      })
      .then((response) => {
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
          navigate("/");
        } else {
          toast.error(message);
        }
      })
      .catch((err) => console.log(err));
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
          <a href="/auth/reset-password" className="forgot-password">
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
