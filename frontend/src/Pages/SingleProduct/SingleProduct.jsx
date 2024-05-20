import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./SingleProduct.css";
import axios from "axios";
import { Helmet } from "react-helmet";
import Layout from "../../components/Layout";
import PageNotFound from "../PNF/PageNotFound";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

import { FaShareAlt, FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";

const SingleProduct = ({ description, keywords, author }) => {
  const { slug } = useParams();
  const [productData, setProductData] = useState(null);
  const [sugProducts, setSugProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `http://192.168.1.10:9080/api/v1/product/single-product/${slug}`
      );
      setProductData(data.product);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong while fetching the product");
      console.log(error);
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchSugData = async () => {
      try {
        if (productData && productData.category) {
          const { data: sugData } = await axios.get(
            "http://192.168.1.10:9080/api/v1/product/get-product"
          );
          if (sugData?.success) {
            const filteredProducts = sugData.products
              .filter(
                (product) =>
                  product.category.name === productData.category.name &&
                  product.type === productData.type &&
                  product._id !== productData._id
              )
              .slice(0, 6);
            setSugProducts(filteredProducts);
          }
        }
      } catch (error) {
        toast.error("Something went wrong while fetching products");
        console.log(error);
      }
    };

    fetchSugData();
  }, [productData]);

  const copyLink = () => {
    const url = window.location.href;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast.success("URL copied to clipboard!");
        })
        .catch((err) => {
          toast.error("Failed to copy URL");
          console.error("Could not copy text: ", err);
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        const msg = successful
          ? "URL copied to clipboard!"
          : "Failed to copy URL";
        toast.success(msg);
      } catch (err) {
        toast.error("Failed to copy URL");
        console.error("Could not copy text: ", err);
      }

      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!productData) {
    return <PageNotFound />;
  }

  return (
    <Layout>
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta charSet="utf-8" />
        <title>{productData.name} | LynxLine</title>
      </Helmet>
      <div className="SingleProduct">
        <div className="sp-product-container">
          <div className="sp-section">
            <div className="sp-container">
              <div className="sp-image-container">
                <img
                  src={`http://192.168.1.10:9080/api/v1/product/product-photo/${productData._id}`}
                  className="product-card-img"
                  alt={productData.name}
                />
              </div>
              <div className="sp-detail-container">
                <div className="sp-detail-top">
                  <h2 className="sp-detail-name">{productData.name}</h2>
                  <p className="sp-detail-price">${productData.price}</p>
                </div>
                <div className="sp-icons-section">
                  <div className="sp-icons-rating">
                    <FaStar />
                  </div>
                  <div className="sp-icons-wishlist">
                    <FaRegHeart className="sp-icon" />
                  </div>
                  <div className="sp-icons-share">
                    <FaShareAlt className="sp-icon" onClick={copyLink} />
                  </div>
                </div>
                <div className="sp-detail-mid">
                  <p>Stock: {productData.quantity}</p>
                  <p>Category: {productData.category.name}</p>
                </div>
                <div className="sp-detail-button">
                  <button className="sp-atb-btn">ADD TO BAG</button>
                </div>
              </div>
            </div>
          </div>

          <div className="sp-suggestion">
            <div className="sp-suggestion-title">
              <h2>You May Also Like</h2>
            </div>
            <div className="sp-suggestion-container">
              {sugProducts.map((p) => (
                <Link to={`/products/${p.slug}`}>
                  <div className="product-card" key={p._id}>
                    <img
                      src={`http://192.168.1.10:9080/api/v1/product/product-photo/${p._id}`}
                      className="product-card-img"
                      alt={p.name}
                    />
                    <div className="product-card-body">
                      <div className="product-card-title">{p.name}</div>
                      <div className="product-card-desc">
                        <div className="product-card-category">
                          {p.category.name}
                        </div>
                        <div className="product-card-type">{p.type}</div>
                        <h4 className="product-card-price">${p.price}</h4>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </Layout>
  );
};

export default SingleProduct;
