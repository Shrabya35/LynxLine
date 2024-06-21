import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import NoFilterResult from "../../assets/No-filter-Results.svg";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { IoClose } from "react-icons/io5";

const ViewMore = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get("category");
  const type = queryParams.get("type");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sort, setSort] = useState("latest");
  const [isMobOpen, setMobOpen] = useState(false);
  const [offerIndex, setOfferIndex] = useState(0);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

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

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/category/get-category`);
        if (data?.success) {
          setCategory(data?.category);
        }
      } catch (error) {
        console.log("Something Went Wrong");
        toast.error("Something Went Wrong");
      }
    };
    getAllCategories();
  }, [baseUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/product/paginated-products?page=${page}&limit=9`
        );
        if (data?.success) {
          let filteredProducts = data.products;
          setTotalPages(data.pages);
          setLoading(false);
          if (categoryFilter) {
            filteredProducts = filteredProducts.filter(
              (product) => product.category.name === categoryFilter
            );
          }

          if (type) {
            filteredProducts = filteredProducts.filter(
              (product) => product.type === type
            );
          }

          console.log("Filtered Products:", filteredProducts);
          setProducts((prevProducts) => [...prevProducts, ...filteredProducts]);
        } else {
          toast.error("Failed to fetch products");
          setLoading(false);
        }
      } catch (error) {
        toast.error("Something went wrong while fetching products");
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [baseUrl, categoryFilter, type, page]);

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
      return products;
    }
    return products.filter((item) =>
      selectedCategories.includes(item.category.name)
    );
  };

  const getSortedResults = () => {
    let filteredResults = getFilteredResults();

    let sortedProducts = [
      ...filteredResults,
      ...products.filter((product) => !filteredResults.includes(product)),
    ];

    if (sort === "latest") {
      sortedProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "oldest") {
      sortedProducts.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sort === "high") {
      sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sort === "low") {
      sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
    return sortedProducts;
  };

  const sortedResults = getSortedResults();

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
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
    <Layout
      title={` View All "${categoryFilter || type}" Products  | LynxLine`}
    >
      <div className="Wishlist">
        <div className="home-offer wishlist-offer">
          <h4 className="home-offer-text">{offers[offerIndex]}</h4>
        </div>
        <div className="whislist-main">
          <div className="wishlist-title">
            <p>View Products for</p>
            <h3>"{categoryFilter || type}"</h3>
          </div>
          <div className="wishlist-container">
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
                        src={`${baseUrl}/product/product-photo/${item._id}`}
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
                          <h4 className="product-card-price">${item.price}</h4>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {products.length !== 0 && sortedResults.length === 0 && (
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
              {page < totalPages && (
                <button className="login-btn" onClick={loadMore}>
                  Load More
                </button>
              )}
            </div>
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

export default ViewMore;
