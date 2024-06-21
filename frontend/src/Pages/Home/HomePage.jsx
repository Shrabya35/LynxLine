import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import "./HomePage.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [gbProducts, setGBProducts] = useState([]);
  const [offerIndex, setOfferIndex] = useState(0);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

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

  useEffect(() => {
    const fetchProducts = async (category) => {
      try {
        const { data } = await axios.get(`${baseUrl}/product/get-product`);
        if (data?.success) {
          const filteredProducts = data.products
            .filter((product) => product.category.name === category)
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

    const fetchData = async () => {
      const freshFitsProducts = await fetchProducts("Fresh Fits");
      setProducts(freshFitsProducts);

      const gymBroProducts = await fetchProducts("Gym Bro");
      setGBProducts(gymBroProducts);
    };
    fetchData();
  }, [baseUrl]);

  const viewMore = (category) => {
    navigate(`/view-more?category=${category}`);
  };

  return (
    <Layout title={"LynxLine - Unleash Your Inner Beast"}>
      <div className="Home">
        <Toaster />
        <div className="home-top">
          <div className="home-offer">
            <h4 className="home-offer-text">{offers[offerIndex]}</h4>
          </div>
          <div className="home-banner-container">
            <div className="home-banner-content">
              <h1>Unleash Your Beast, Anytime, Anywhere</h1>
              <p>Brand new drops, brand new reasons to unleash your beast.</p>
            </div>
            <div className="home-banner-button">
              <a
                href="/women"
                className="home-banner-btn home-banner-btn-women"
              >
                Shop Women
              </a>
              <a href="/men" className="home-banner-btn home-banner-btn-men">
                Shop Men
              </a>
            </div>
          </div>
        </div>
        <div className="home-down">
          <div className="home-category-1">
            <div className="home-product-title">
              <h2>Fresh Fits</h2>
              <p onClick={() => viewMore("Fresh Fits")}>View all</p>
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
          <div className="home-banner-2 home-banner-container">
            <div className="home-banner-content home-banner2-content">
              <h1>Gym Bro Tshirts</h1>
              <p>Brand new drops for the Gym Bros</p>
            </div>
            <div className="home-banner-button">
              <button className="home-banner-btn">Shop Now</button>
            </div>
          </div>
          <div className="home-category-2 home-category-1">
            <div className="home-product-title">
              <h2>Gym Bro T-shirts</h2>
              <p onClick={() => viewMore("Gym Bro")}>View all</p>
            </div>
            <div className="product-card-container">
              {gbProducts.map((p) => (
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
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
