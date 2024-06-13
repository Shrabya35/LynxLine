import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "./SingleProduct.css";
import axios from "axios";
import { Helmet } from "react-helmet";
import Layout from "../../components/Layout";
import PageNotFound from "../PNF/PageNotFound";
import toast, { Toaster } from "react-hot-toast";
import { FaShareAlt, FaStar } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

const SingleProduct = () => {
  const { slug } = useParams();
  const [productData, setProductData] = useState(null);
  const [sugProducts, setSugProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const userDetailsString = useMemo(
    () =>
      localStorage.getItem("userDetails") ||
      sessionStorage.getItem("userDetails"),
    []
  );
  const userDetails = useMemo(
    () => JSON.parse(userDetailsString),
    [userDetailsString]
  );
  const userEmail = userDetails?.email;

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `http://192.168.1.10:9080/api/v1/product/single-product/${slug}`
      );
      setProductData(data.product);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong while fetching the product");
      console.error(error);
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
              .slice(0, 5);
            setSugProducts(filteredProducts);
          }
        }
      } catch (error) {
        toast.error("Something went wrong while fetching products");
        console.error(error);
      }
    };

    fetchSugData();
  }, [productData]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (userEmail && productData) {
        try {
          const response = await axios.get(
            `http://192.168.1.10:9080/api/v1/auth/wishlist/${userEmail}`
          );
          const wishlist = response.data.wishlist;
          setIsWishlisted(
            wishlist.some((item) => item._id === productData._id)
          );
        } catch (error) {
          console.error("Error checking wishlist:", error);
        }
      }
    };

    checkWishlist();
  }, [productData, userEmail]);

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      toast.error("Sign In to wishlist your favourite items");
      return;
    }
    try {
      const endpoint = isWishlisted
        ? "http://192.168.1.10:9080/api/v1/auth/remove-wishlist"
        : "http://192.168.1.10:9080/api/v1/auth/add-wishlist";
      await axios.post(endpoint, {
        email: userEmail,
        productId: productData._id,
      });
      setIsWishlisted(!isWishlisted);
      toast.success(
        isWishlisted ? "Item removed from wishlist" : "Item added to wishlist"
      );
    } catch (error) {
      toast.error("Error updating wishlist");
      console.error("Error updating wishlist:", error);
    }
  };

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
    <Layout title={`${productData.name} - LynxLine`}>
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
                  <div className="sp-icons-wishlist" onClick={handleWishlist}>
                    {isWishlisted ? (
                      <FaHeart className="sp-icon" />
                    ) : (
                      <FaRegHeart className="sp-icon" />
                    )}
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

          {sugProducts.length !== 0 && (
            <div className="sp-suggestion">
              <div className="sp-suggestion-title">
                <h2>You May Also Like</h2>
              </div>
              <div className="sp-suggestion-container">
                {sugProducts.map((p) => (
                  <Link to={`/products/${p.slug}`} key={p._id}>
                    <div className="product-card">
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
          )}
        </div>
        <Toaster />
      </div>
    </Layout>
  );
};

export default SingleProduct;
