import React from "react";
import "./PageNotFound.css";
import Layout from "../../components/Layout";
const PageNotFound = () => {
  return (
    <Layout title={"404 Error! | LynxLine"}>
      <div className="PNF">
        <div className="pnf-container pnf-flex">
          <div className="pnf-content pnf-flex">
            <h2 className="pnf-title">404! Page Not Found</h2>
            <p className="pnf-desc">
              We can't seem to find the page that you were looking for.
            </p>
          </div>
          <div className="pnf-buttons pnf-flex">
            <a href="/men" className="pnf-btn1 pnf-btn">
              Shop Mens
            </a>
            <a href="/women" className="pnf-btn2 pnf-btn">
              Shop Womens
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PageNotFound;
