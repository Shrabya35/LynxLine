import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./ShoppingBag.css";
import Layout from "../../components/Layout";

import { nanoid } from "nanoid";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import NoFilterResult from "../../assets/No-filter-Results.svg";

import { FaPlus, FaMinus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";

const ShoppingBag = () => {
  const navigate = useNavigate();
  const [bag, setBag] = useState([]);
  const [subtotal, setSubtotal] = useState("");
  const [shippingFee, setShippingFee] = useState("");
  const [total, setTotal] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const [loading, setLoading] = useState(true);
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
    const fetchBag = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/user/shoppingBag/${userEmail}`
        );
        const bagData = response.data;
        setBag(bagData.shoppingBag);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error checking wishlist:", error);
      }
    };

    fetchBag();
  }, [baseUrl, userEmail]);

  const handleRemoveItem = async (productId) => {
    try {
      const response = await axios.post(`${baseUrl}/user/remove-shoppingBag`, {
        email: userEmail,
        productId: productId,
      });
      const res = await axios.get(
        `${baseUrl}/user/shoppingBag-total/${userEmail}`
      );
      const bagPrice = res.data;
      const updatedBag = bag.filter((item) => item.product._id !== productId);
      setBag(updatedBag);
      setSubtotal(bagPrice.subtotal);
      setTotal(bagPrice.total);
      setTotalItems(bagPrice.totalItems);
      setShippingFee(bagPrice.shippingFee);

      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error removing item from shopping bag");
      console.error("Error removing item from shopping bag:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.put(
        `${baseUrl}/user/updateQuantity/${userEmail}`,
        { email: userEmail, productId, quantity: newQuantity }
      );
      const { shoppingBag } = response.data;
      setBag(shoppingBag);

      const res = await axios.get(
        `${baseUrl}/user/shoppingBag-total/${userEmail}`
      );
      const bagPrice = res.data;
      setSubtotal(bagPrice.subtotal);
      setTotal(bagPrice.total);
      setTotalItems(bagPrice.totalItems);
      setShippingFee(bagPrice.shippingFee);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/user/shoppingBag-total/${userEmail}`
        );
        const bagPrice = response.data;
        setSubtotal(bagPrice.subtotal);
        setTotal(bagPrice.total);
        setTotalItems(bagPrice.totalItems);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    fetchPrice();
  }, [baseUrl, userEmail]);

  const handleProceedToCheckout = () => {
    const storedToken = sessionStorage.getItem("checkoutToken");

    if (storedToken) {
      navigate(`/checkout?cts=${storedToken}`);
    } else {
      const newToken = nanoid();
      sessionStorage.setItem("checkoutToken", newToken);
      navigate(`/checkout?cts=${newToken}`);
    }
  };

  if (loading) {
    return (
      <Layout title={`Loading...`}>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout title={`Shopping Bag | LynxLine`}>
      <div className="ShoppingBag">
        <div className="home-offer wishlist-offer">
          <h4 className="home-offer-text">{offers[offerIndex]}</h4>
        </div>
        <div className="shopping-bag-container">
          <div className="shopping-bag-section">
            <div className="sb-card-container">
              {bag.map((item) => (
                <div className="sb-product-card" key={item.product._id}>
                  <Link to={`/products/${item.product.slug}`}>
                    <img
                      src={`${baseUrl}/product/product-photo/${item.product._id}`}
                      className="sb-product-card-img"
                      alt={item.product.name}
                    />
                  </Link>
                  <div className="sb-product-card-body">
                    <div className="sb-product-card-title">
                      {item.product.name}
                    </div>
                    <div className="sb-product-card-mid">
                      <h4 className="sb-product-card-price">
                        ${item.product.price}
                      </h4>
                      <div className="sb-product-card-mid-buttons">
                        <FaRegTrashAlt
                          className="sb-product-card-mid-btn"
                          onClick={() => handleRemoveItem(item.product._id)}
                        />
                      </div>
                    </div>
                    <div className="sb-product-card-quantity">
                      {item.quantity > 1 ? (
                        <div
                          className="sb-quantity-alter-btn"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                        >
                          <FaMinus />
                        </div>
                      ) : (
                        <div className="sb-quantity-alter-btn-inactive">
                          <FaMinus />
                        </div>
                      )}
                      {item.quantity}
                      {item.quantity < item.product.quantity ? (
                        <div
                          className="sb-quantity-alter-btn"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                        >
                          <FaPlus />
                        </div>
                      ) : (
                        <div className="sb-quantity-alter-btn-inactive">
                          <FaPlus />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {bag.length === 0 && (
              <div className="no-filter-result">
                <div className="no-filter-result-container">
                  <div className="no-filter-result-img">
                    <img src={NoFilterResult} alt="no-filter-result" />
                  </div>
                  <div className="no-filter-result-title">
                    <h4>Empty Bag Alert!</h4>
                    <p>
                      Your bag looks a bit lonely. It's time to fill it up with
                      your favorite goodies!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="sb-order-summary">
            <div className="sb-order-summary-container">
              <div className="sb-os-title">
                <h4>Order Summary</h4>
              </div>
              <div className="sb-os-subtotal">
                <p>Subtotal ({totalItems} items)</p>
                <p>$ {subtotal}</p>
              </div>
              <div className="sb-os-shipping">
                <p>Estimated Shipping </p>
                {subtotal === 0 ? <p>$ {subtotal}</p> : <p>$ {shippingFee}</p>}
              </div>
              <div className="sb-os-total">
                <p>Total</p>
                {subtotal === 0 ? <p>$ {subtotal}</p> : <p>$ {total}</p>}
              </div>
              <div className="sb-os-checkout">
                <button
                  className="sb-os-checkout-btn checkout-order-btn"
                  onClick={handleProceedToCheckout}
                >
                  Checkout Securely ({bag.length})
                </button>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </Layout>
  );
};

export default ShoppingBag;
