import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./Wishlist.css";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import NoFilterResult from "../../assets/No-filter-Results.svg";
import NoWishlist from "../../assets/no-wishlist.svg";

const Wishlist = ({ description, keywords, author }) => {
  const [wishlist, setWishlist] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [offerIndex, setOfferIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const offers = [
    "🎉 Shop over $75 & enjoy FREE delivery🚚💰",
    "🌟 Discover our exclusive deals & discounts this month! 💸✨",
    "💳 Get 20% off on your purchase with code BlackNigga! 💳🛍️",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [offers.length]);

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

  const wishlistMobOpen = () => {
    setWishlistOpen(!isWishlistOpen);
  };

  const wishlistMobClose = () => {
    setWishlistOpen(false);
  };

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://192.168.1.10:9080/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategory(data?.category);
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const fetchWishlist = async (page) => {
      try {
        const response = await axios.get(
          `http://192.168.1.10:9080/api/v1/user/wishlist/${userEmail}?page=${page}&limit=9`
        );
        const wishlistData = response.data;
        setWishlist(wishlistData.wishlist);
        setTotalPages(wishlistData.pages);
        setLoading(false);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    fetchWishlist(page);
  }, [page, userEmail]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) =>
        prev.filter((category) => category !== value)
      );
    }
  };

  const getFilteredWishlist = () => {
    if (selectedCategories.length === 0) {
      return wishlist;
    }
    return wishlist.filter((item) =>
      selectedCategories.includes(item.category.name)
    );
  };

  const getSortedWishlist = () => {
    let filteredWishlist = getFilteredWishlist();
    if (sort === "latest") {
      filteredWishlist.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "oldest") {
      filteredWishlist.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sort === "high") {
      filteredWishlist.sort(
        (a, b) => parseFloat(b.price) - parseFloat(a.price)
      );
    } else if (sort === "low") {
      filteredWishlist.sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      );
    }
    return filteredWishlist;
  };

  const sortedWishlist = getSortedWishlist();

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === page ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta charSet="utf-8" />
        <title>Wishlist | LynxLine</title>
      </Helmet>
      <div className="Wishlist">
        <div className="home-offer wishlist-offer">
          <h4 className="home-offer-text">{offers[offerIndex]}</h4>
        </div>
        <div className="whislist-main">
          <div className="wishlist-title">
            <h1>Your WishList</h1>
            <p>{wishlist.length} items</p>
          </div>
          <div className="wishlist-container">
            {wishlist.length !== 0 ? (
              <div className="wishlist-left">
                <div className="wishlist-left-title">
                  <h2 className="wishlist-left-title-text">Filter</h2>
                  <div
                    className="wishlist-mob-filter-dropdown"
                    onClick={wishlistMobOpen}
                  >
                    <TbAdjustmentsHorizontal />
                    Browse By
                  </div>
                </div>
                <div className="wishlist-filters">
                  <div className="wishlist-filter-categories">
                    <h4>Filter by category</h4>
                    <div className="wishlist-filter-select">
                      {Array.isArray(category) &&
                        category.map((c) => (
                          <div className="wishlist-category-list" key={c._id}>
                            <input
                              type="checkbox"
                              value={c.name}
                              checked={selectedCategories.includes(c.name)}
                              onChange={handleCheckboxChange}
                            />
                            {c.name}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-wishlist">
                <div className="no-wishlist-container">
                  <div className="no-wishlist-img">
                    <img src={NoWishlist} alt="no-wishlist" />
                  </div>
                  <div className="no-wishlist-title">
                    <h3>YOUR WISHLIST IS EMPTY</h3>
                    <p>
                      Any items that you save while browsing, will be added
                      here, to your wishlist.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {wishlist.length > 0 && (
              <div className="wishlist-right">
                <div className="wishlist-right-sort">
                  Sort by :
                  <select
                    className="wishlist-right-sort-select"
                    onChange={handleSortChange}
                    value={sort}
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="high">Price High To Low</option>
                    <option value="low">Price Low To High</option>
                  </select>
                </div>
                <div className="whishlist-card-container">
                  {sortedWishlist.map((item) => (
                    <Link to={`/products/${item.slug}`} key={item._id}>
                      <div className="wishlist-card product-card">
                        <img
                          src={`http://192.168.1.10:9080/api/v1/product/product-photo/${item._id}`}
                          className="product-card-img"
                          alt={item.name}
                        />
                        <div className="product-card-body">
                          <div className="product-card-title">{item.name}</div>
                          <div className="product-card-desc">
                            <div className="product-card-category">
                              {item.category.name}
                            </div>
                            <div className="product-card-type">{item.type}</div>
                            <h4 className="product-card-price">
                              ${item.price}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {wishlist.length !== 0 && sortedWishlist.length === 0 && (
                    <div className="no-filter-result">
                      <div className="no-filter-result-container">
                        <div className="no-filter-result-img">
                          <img src={NoFilterResult} alt="no-filter-result" />
                        </div>
                        <div className="no-filter-result-title">
                          <h3>NO RESULTS FOUND</h3>
                          <p>
                            Sorry, we can't find any products that match your
                            filters.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="pagination-container">{renderPagination()}</div>
              </div>
            )}
          </div>
          <div className={`wishlist-mob ${isWishlistOpen ? "open" : ""}`}>
            <div className="wishlist-mob-up">
              <div className="wishlist-close">
                <IoClose
                  className="wishlist-close-icon"
                  onClick={wishlistMobClose}
                />
              </div>
              <h3 className="wishlist-mob-title">Filters</h3>
              <div className="wishlist-mob-hide">hide text</div>
            </div>
            <div className="wishlist-filters-mob">
              <div className="wishlist-filter-categories">
                <h4>Filter by category</h4>
                <div className="wishlist-filter-select">
                  {Array.isArray(category) &&
                    category.map((c) => (
                      <div className="wishlist-category-list" key={c._id}>
                        <input
                          type="checkbox"
                          value={c.name}
                          checked={selectedCategories.includes(c.name)}
                          onChange={handleCheckboxChange}
                        />
                        {c.name}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
