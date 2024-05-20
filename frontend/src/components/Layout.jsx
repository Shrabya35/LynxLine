import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta charSet="utf-8" />
        <title> {title} </title>
      </Helmet>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "LynxLine - Unleash Your Inner Beast",
  description: "Official Store of LynxLine",
  keywords: "LynxLine,Sports wear, gym wears",
  author: "LynxLine CO.",
};

export default Layout;
