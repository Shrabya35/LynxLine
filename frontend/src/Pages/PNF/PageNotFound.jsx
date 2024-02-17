import React from "react";
import "./PageNotFound.css";
import Layout from "../../components/Layout";
const PageNotFound = () => {
  return (
    <Layout title={"404 Error"}>
      <div className="PNF">
        <div className="pnf-container pnf-flex">
          <div className="pnf-content pnf-flex">
            <h1 className="pnf-title">404 PAGE NOT FOUND</h1>
            <p className="pnf-desc">
              We can't seem to find the page that you were looking for.
            </p>
          </div>
          <div className="pnf-buttons pnf-flex">
            <a href="/" className="pnf-btn1 pnf-btn">
              Shop Mens
            </a>
            <a href="/" className="pnf-btn2 pnf-btn">
              Shop Womens
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PageNotFound;
