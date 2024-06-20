import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import NoFilterResult from "../../assets/No-filter-Results.svg";
import Layout from "../../components/Layout";
import toast, { Toaster } from "react-hot-toast";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sort, setSort] = useState("latest");
  const [isMobOpen, setMobOpen] = useState(false);
  const [offerIndex, setOfferIndex] = useState(0);

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
      toast.error("SOmething Went Wrong");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const fetchSearchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://192.168.1.10:9080/api/v1/product/search-product/${searchTerm}?page=${page}&limit=9`
        );
        if (data && data.results) {
          setSearchResult(data.results);
          setTotalPages(data.pages);
        } else {
          setSearchResult([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setLoading(false);
      }
    };

    fetchSearchData();
  }, [searchTerm, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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

  const getFilteredResults = () => {
    if (selectedCategories.length === 0) {
      return searchResult;
    }
    return searchResult.filter((item) =>
      selectedCategories.includes(item.category.name)
    );
  };

  const getSortedResults = () => {
    let filteredResults = getFilteredResults();
    if (sort === "latest") {
      filteredResults.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "oldest") {
      filteredResults.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sort === "high") {
      filteredResults.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sort === "low") {
      filteredResults.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
    return filteredResults;
  };

  const sortedResults = getSortedResults();
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    if (sortedResults.length === 0) return null;
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

  const searchMobOpen = () => {
    setMobOpen(true);
  };

  const searchMobClose = () => {
    setMobOpen(false);
  };

  if (loading) {
    return (
      <Layout title={`Loading...`}>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout title={` Search "${searchTerm}"  | LynxLine`}>
      <div className="Wishlist">
        <div className="home-offer wishlist-offer">
          <h4 className="home-offer-text">{offers[offerIndex]}</h4>
        </div>
        <div className="whislist-main">
          <div className="wishlist-title">
            <p>Search Result for</p>
            <h3>"{searchTerm}"</h3>
          </div>
          <div className="wishlist-container">
            {searchResult.length !== 0 ? (
              <div className="wishlist-left">
                <div className="wishlist-left-title">
                  <h2 className="wishlist-left-title-text">Filter</h2>
                  <div
                    className="wishlist-mob-filter-dropdown"
                    onClick={searchMobOpen}
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
                    <img src={NoFilterResult} alt="no-wishlist" />
                  </div>
                  <div className="no-wishlist-title">
                    <h3>No results found for "{searchTerm}"</h3>
                    <p>
                      You can try using a different search term or refine your
                      search criteria.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {searchResult.length > 0 && (
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
                  {sortedResults.map((item) => (
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
                  {searchResult.length !== 0 && sortedResults.length === 0 && (
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
          <div className={`wishlist-mob ${isMobOpen ? "open" : ""}`}>
            <div className="wishlist-mob-up">
              <div className="wishlist-close">
                <IoClose
                  className="wishlist-close-icon"
                  onClick={searchMobClose}
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
        <Toaster />
      </div>
    </Layout>
  );
};

export default SearchPage;
