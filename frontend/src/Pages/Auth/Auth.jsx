import React from "react";
import "./Auth.css";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";

import LogSign from "./LogSign";
import AuthImage from "../../assets/auth.jpg";
import AuthLogo from "../../assets/logo.png";

const Auth = ({ description, keywords, author }) => {
  return (
    <div className="Auth">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />

        <meta charSet="utf-8" />
        <title> Authorization - LynxLine</title>
      </Helmet>
      <div className="auth-container">
        <div className="auth-left">
          <img src={AuthImage} alt="Authentication" className="auth-image" />
          <div className="auth-image-text">
            <p className="auth-image-small-text">Unleash your inner beast</p>
            <h1>Welcome to LynxLine</h1>
            <p className="auth-image-text-description">
              Save your most-loved activewear pieces to build your perfect
              outfit
            </p>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-logo">
            <img src={AuthLogo} alt="" className="auth-img" />
          </div>
          <div className="auth-form">
            <LogSign />
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
};

Auth.defaultProps = {
  title: "LynxLine - Unleash Your Inner Beast",
  description: "Official Store of LynxLine",
  keywords: "LynxLine,Sports wear, gym wears",
  author: "LynxLine CO.",
};

export default Auth;
