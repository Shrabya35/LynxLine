import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./Wishlist.css";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet";

const Wishlist = ({ description, keywords, author }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.10:9080/api/v1/auth/wishlist/${userEmail}`
        );
        const wishlistData = response.data;
        setWishlist(wishlistData);
        setLoading(false);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };
    fetchWishlist();
  }, [userEmail]);

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
        <div className="wishlist-container">
          <ul>
            {wishlist.map((item) => (
              <li key={item._id}>{item.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
