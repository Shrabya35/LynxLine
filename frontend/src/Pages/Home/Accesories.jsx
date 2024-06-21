import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import "./HomePage.css";
import "./MWA.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const Accessories = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [offerIndex, setOfferIndex] = useState(0);
  const baseUrl = window.env.REACT_APP_API_BASE_URL;

  const offers = [
    "🎉 Shop over $75 & enjoy FREE delivery🚚💰",
    "🌟 Discover our exclusive deals & discounts this month! 💸✨",
    "💳 Get 20% off on your purchase with code BLACKNIGGA 💳🛍️",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [offers.length]);

  const fetchProducts = async (type) => {
    try {
      const { data } = await axios.get(`${baseUrl}/product/get-product`);
      if (data?.success) {
        const filteredProducts = data.products
          .filter((product) => product.type === type)
          .slice(0, 9);
        return filteredProducts;
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching products");
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const accessoriesProducts = await fetchProducts("Accessories");
      setProducts(accessoriesProducts);
    };
    fetchData();
  }, []);

  const viewMore = (type) => {
    navigate(`/view-more?type=${type}`);
  };

  return (
    <Layout title={"LynxLine - Unleash Your Inner Beast"}>
      <div className="Home">
        <Toaster />
        <div className="home-top">
          <div className="home-offer">
            <h4 className="home-offer-text">{offers[offerIndex]}</h4>
          </div>
          <div className="home-banner-container accessories-banner-container">
            <div className="accessories-banner-section">
              <div className="home-banner-content accessories-banner-contents">
                <h1>Accessorize Your Adventure!</h1>
                <p>
                  Unlock the latest drops to elevate your style game and conquer
                  any terrain.
                </p>
              </div>
              <div className="home-banner-button accessories-banner-btn">
                <a
                  href="#shop-accessories"
                  className="home-banner-btn home-banner-btn-men"
                >
                  Shop Accessories
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="home-down">
          <div className="home-category-1" id="shop-accessories">
            <div className="home-product-title">
              <h2>Accessories</h2>
              <p onClick={() => viewMore("Accessories")}>View all</p>
            </div>
            <div className="product-card-container">
              {products.map((p) => (
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
          <div className="home-picks-1">
            <div className="home-picks-title">
              <h2>LynxLine Top Picks</h2>
            </div>
            <div className="home-picks-container">
              <div className="picks-card picks-card1">
                <h2>SPORTSWEAR</h2>
                <button className="home-banner-btn">Shop Now</button>
              </div>
              <div className="picks-card picks-card2">
                <h2>IRONGEAR</h2>
                <button className="home-banner-btn">Shop Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Accessories;
