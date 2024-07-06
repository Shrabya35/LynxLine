import React from "react";
import { Helmet } from "react-helmet";
import "./AdminLayout.css";
import AdminNav from "./AdminNav";

const AdminLayout = ({ children, title, description, keywords, author }) => {
  return (
    <div className="admin-layout">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta charSet="utf-8" />
        <title> {title} </title>
      </Helmet>
      <AdminNav />
      <main className="admin-main">
        <div className="admin-layout-children"> {children}</div>
      </main>
    </div>
  );
};

AdminLayout.defaultProps = {
  title: "LynxLine - Unleash Your Inner Beast",
  description: "Official Store of LynxLine",
  keywords: "LynxLine,Sports wear, gym wears",
  author: "LynxLine CO.",
};

export default AdminLayout;
