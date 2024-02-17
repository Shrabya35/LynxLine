import React, { useState } from "react";
import "./LogSign.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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
        } else {
          toast.error(message);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="signup">
      <Toaster />
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

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <form>
        <label htmlFor="chk" aria-hidden="true">
          Login
        </label>
        <input
          className="auth-input"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <div className="password-input">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            name="pswd"
            placeholder="Password"
            required
          />
          <span className="password-toggle-icon" onClick={handleTogglePassword}>
            {showPassword ? <GoEye /> : <GoEyeClosed />}
          </span>
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
