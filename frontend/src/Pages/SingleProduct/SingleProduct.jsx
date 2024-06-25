import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "./SingleProduct.css";
import axios from "axios";
import Layout from "../../components/Layout";
import PageNotFound from "../PNF/PageNotFound";
import toast, { Toaster } from "react-hot-toast";
import { FaShareAlt, FaStar, FaRegStar } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

const SingleProduct = () => {
  const { slug } = useParams();
  const [productData, setProductData] = useState(null);
  const [sugProducts, setSugProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [userRatingData, setUserRatingData] = useState(0);
  const [ratingsData, setRatingsData] = useState({
    averageRating: 0,
    totalRatings: 0,
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

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

  useEffect(() => {
    if (userDetails) {
      const fetchUserRef = async () => {
        if (userEmail) {
          try {
            const { data } = await axios.get(
              `${baseUrl}/user/user-details/${userEmail}`
            );
            setUserDetail(data.user);
          } catch (error) {
            toast.error("Something went wrong while fetching the user details");
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
      };

      fetchUserRef();
    }
  }, [baseUrl, userEmail, userDetails]);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/product/single-product/${slug}`
      );
      setProductData(data.product);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong while fetching the product");
      console.error(error);
      setLoading(false);
    }
  }, [baseUrl, slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchSugData = async () => {
      try {
        if (productData && productData.category) {
          const { data: sugData } = await axios.get(
            `${baseUrl}/product/get-product`
          );
          if (sugData?.success) {
            const filteredProducts = sugData.products
              .filter(
                (product) =>
                  product.category.name === productData.category.name &&
                  product.type === productData.type &&
                  product._id !== productData._id
              )
              .slice(0, 9);
            setSugProducts(filteredProducts);
          }
        }
      } catch (error) {
        toast.error("Something went wrong while fetching products");
        console.error(error);
      }
    };

    fetchSugData();
  }, [baseUrl, productData]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (userEmail && productData) {
        try {
          const response = await axios.get(
            `${baseUrl}/user/wishlist/${userEmail}`
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
  }, [baseUrl, productData, userEmail]);

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      toast.error("Sign In to wishlist your favourite items");
      return;
    }
    try {
      const endpoint = isWishlisted
        ? `${baseUrl}/user/remove-wishlist`
        : `${baseUrl}/user/add-wishlist`;
      const response = await axios.post(endpoint, {
        email: userEmail,
        productId: productData._id,
      });
      setIsWishlisted(!isWishlisted);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error updating wishlist");
      console.error("Error updating wishlist:", error);
    }
  };
  const handleShoppingBag = async () => {
    try {
      const response = await axios.post(`${baseUrl}/user/add-shoppingBag`, {
        email: userEmail,
        productId: productData._id,
      });
      toast.success(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while updating the shopping bag.");
        console.error("Error updating Shopping Bag:", error);
      }
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

  let stockMessage;
  let StockMessageColor;
  if (productData && productData.quantity >= 10) {
    stockMessage = "In Stock";
    StockMessageColor = "#28a745";
  } else if (
    productData &&
    productData.quantity < 10 &&
    productData.quantity !== 0
  ) {
    stockMessage = "Low On Stock";
    StockMessageColor = "#ff9800";
  } else if (productData && productData.quantity === 0) {
    stockMessage = "Out Of Stock";
    StockMessageColor = "#dc3545";
  }

  const handleAddRating = async (rating) => {
    if (!isLoggedIn) {
      toast.error("Sign In to rate the product");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/product/add-rating`, {
        userId: userDetail._id,
        productId: productData._id,
        rating,
      });

      const res = await axios.get(
        `${baseUrl}/user/${userDetail._id}/product-ratings/${productData._id}`
      );
      setUserRatingData(res.data.userRating);

      const res2 = await axios.get(
        `${baseUrl}/product/product-ratings/${productData._id}`
      );
      setRatingsData({
        averageRating: res2.data.averageRating,
        totalRatings: res2.data.totalRatings,
        oneStar: res2.data.oneStar,
        twoStar: res2.data.twoStar,
        threeStar: res2.data.threeStar,
        fourStar: res2.data.fourStar,
        fiveStar: res2.data.fiveStar,
      });

      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error adding rating");
      console.error("Error adding rating:", error);
    }
  };

  useEffect(() => {
    const fetchProductRatings = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/product/product-ratings/${productData._id}`
        );
        setRatingsData({
          averageRating: response.data.averageRating,
          totalRatings: response.data.totalRatings,
          oneStar: response.data.oneStar,
          twoStar: response.data.twoStar,
          threeStar: response.data.threeStar,
          fourStar: response.data.fourStar,
          fiveStar: response.data.fiveStar,
        });
      } catch (error) {
        toast.error("Failed to fetch ratings");
        console.error("failed to fetch ratings: ", error);
      }
    };

    if (productData) {
      fetchProductRatings();
    }
  }, [baseUrl, productData]);

  useEffect(() => {
    const fetchProductUserRating = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/user/${userDetail._id}/product-ratings/${productData._id}`
        );
        setUserRatingData(response.data.userRating);
      } catch (error) {
        console.error("failed to fetch user-ratings: ", error);
      }
    };
    if (productData && isLoggedIn) {
      fetchProductUserRating();
    }
  });

  if (loading) {
    return (
      <Layout title={`Loading...`}>
        <p>Loading...</p>
      </Layout>
    );
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
                  src={`${baseUrl}/product/product-photo/${productData._id}`}
                  className="product-card-img"
                  alt={productData.name}
                />
              </div>
              <div className="sp-detail-container">
                <div className="sp-detail-top">
                  <div className="sp-detail-top-dtl">
                    <p>
                      <FaStar className="sp-rating-icon sp-detail-top-dtl-star" />
                      <strong>{ratingsData.averageRating}</strong>
                      <span className="sp-rating-top-dtl-span">
                        ({ratingsData.totalRatings}) ratings
                      </span>
                    </p>
                    <strong
                      className="stock-status"
                      style={{ color: StockMessageColor }}
                    >
                      {stockMessage}
                    </strong>
                  </div>
                  <h3 className="sp-detail-name">{productData.name}</h3>
                </div>
                <h2 className="sp-detail-price">${productData.price}</h2>
                <p className="sp-product-description">
                  {productData.description}
                </p>
                <div className="sp-detail-mid">
                  <p>
                    <strong>Category : </strong>
                    {productData.category.name}
                  </p>
                  <p>
                    <strong>Availability : </strong>
                    {productData.quantity} products in stocks
                  </p>
                </div>
                <div className="sp-detail-buttons">
                  <div className="sp-icons-wishlist" onClick={handleWishlist}>
                    {isWishlisted ? (
                      <FaHeart className="sp-icon" />
                    ) : (
                      <FaRegHeart className="sp-icon" />
                    )}
                  </div>
                  <button className="sp-atb-btn" onClick={handleShoppingBag}>
                    ADD TO BAG
                  </button>
                  <div className="sp-icons-share">
                    <FaShareAlt className="sp-icon" onClick={copyLink} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sp-ratings">
            <div className="sp-rating-title-section">
              <p className="sp-rating-title">User Ratings </p>
            </div>
            <div className="sp-rating-body">
              <div className="sp-rating-average-ratings">
                <div className="sp-rating-average-rating">
                  <FaStar className="sp-rating-average-rating-icon sp-rating-icon" />
                  <p className="sp-rating-average-rating-text">
                    {ratingsData.averageRating}
                  </p>
                </div>
                <div className="sp-rting-average-total">
                  <p>{ratingsData.totalRatings} ratings</p>
                </div>
              </div>
              <div className="sp-rating-all-ratings">
                <div className="sp-rating-5star sp-all-rating-stars">
                  <div className="sp-rating-body-stars">
                    <FaStar className="sp-rating-icon" />{" "}
                    <FaStar className="sp-rating-icon" />{" "}
                    <FaStar className="sp-rating-icon" />{" "}
                    <FaStar className="sp-rating-icon" />{" "}
                    <FaStar className="sp-rating-icon" />
                  </div>
                  <p className="sp-rating-body-starcount">
                    {ratingsData.fiveStar}
                  </p>
                </div>
                <div className="sp-rating-4star  sp-all-rating-stars">
                  <div className="sp-rating-body-stars">
                    <FaStar className="sp-rating-icon" />{" "}
                    <FaStar className="sp-rating-icon" />{" "}
                    <FaStar className="sp-rating-icon" />{" "}
                    <FaStar className="sp-rating-icon" /> <FaRegStar />
                  </div>
                  <p className="sp-rating-body-starcount">
                    {ratingsData.fourStar}
                  </p>
                </div>
                <div className="sp-rating-3star  sp-all-rating-stars">
                  <div className="sp-rating-body-stars">
                    <FaStar className="sp-rating-icon" />{" "}
                    <FaStar className="sp-rating-icon" />{" "}
                    <FaStar className="sp-rating-icon" /> <FaRegStar />{" "}
                    <FaRegStar />
                  </div>
                  <p className="sp-rating-body-starcount">
                    {ratingsData.threeStar}
                  </p>
                </div>
                <div className="sp-rating-2star  sp-all-rating-stars">
                  <div className="sp-rating-body-stars">
                    <FaStar className="sp-rating-icon" />{" "}
                    <FaStar className="sp-rating-icon" /> <FaRegStar />{" "}
                    <FaRegStar /> <FaRegStar />
                  </div>
                  <p className="sp-rating-body-starcount">
                    {ratingsData.twoStar}
                  </p>
                </div>
                <div className="sp-rating-1star  sp-all-rating-stars">
                  <div className="sp-rating-body-stars">
                    <FaStar className="sp-rating-icon" /> <FaRegStar />{" "}
                    <FaRegStar /> <FaRegStar /> <FaRegStar />
                  </div>
                  <p className="sp-rating-body-starcount">
                    {ratingsData.oneStar}
                  </p>
                </div>
              </div>
            </div>
            <div className="sp-rating-user-rate">
              <div
                className="sp-user-rating-5star sp-user-rating-star"
                style={
                  userRatingData === 5 ? { border: "1px solid #808080" } : {}
                }
                onClick={() => handleAddRating(5)}
              >
                <FaStar className="sp-rating-icon" />
                <p>5</p>
              </div>
              <div
                className="sp-user-rating-4star  sp-user-rating-star"
                style={
                  userRatingData === 4 ? { border: "1px solid #808080" } : {}
                }
                onClick={() => handleAddRating(4)}
              >
                <FaStar className="sp-rating-icon" />
                <p>4</p>
              </div>
              <div
                className="sp-user-rating-3star  sp-user-rating-star"
                style={
                  userRatingData === 3 ? { border: "1px solid #808080" } : {}
                }
                onClick={() => handleAddRating(3)}
              >
                <FaStar className="sp-rating-icon" />
                <p>3</p>
              </div>
              <div
                className="sp-user-rating-2star  sp-user-rating-star"
                style={
                  userRatingData === 2 ? { border: "1px solid #808080" } : {}
                }
                onClick={() => handleAddRating(2)}
              >
                <FaStar className="sp-rating-icon" />
                <p>2</p>
              </div>
              <div
                className="sp-user-rating-1star  sp-user-rating-star"
                style={
                  userRatingData === 1 ? { border: "1px solid #808080" } : {}
                }
                onClick={() => handleAddRating(1)}
              >
                <FaStar className="sp-rating-icon" />
                <p>1</p>
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
                        src={`${baseUrl}/product/product-photo/${p._id}`}
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
