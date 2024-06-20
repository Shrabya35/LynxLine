import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./ShoppingBag.css";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa6";

const ShoppingBag = () => {
  const [bag, setBag] = useState([]);
  const [subtotal, setSubtotal] = useState("");
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(true);
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
          `http://192.168.1.10:9080/api/v1/user/shoppingBag/${userEmail}`
        );
        const bagData = response.data;
        setBag(bagData.shoppingBag);
        setLoading(false);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    fetchBag();
  }, [userEmail]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.10:9080/api/v1/user/shoppingBag-total/${userEmail}`
        );
        const bagPrice = response.data;
        setSubtotal(bagPrice.subtotal);
        setTotal(bagPrice.total);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    fetchPrice();
  }, [userEmail]);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.put(
        `http://192.168.1.10:9080/api/v1/user/updateQuantity/${userEmail}`,
        { email: userEmail, productId, quantity: newQuantity }
      );
      const { shoppingBag } = response.data;
      setBag(shoppingBag);

      const res = await axios.get(
        `http://192.168.1.10:9080/api/v1/user/shoppingBag-total/${userEmail}`
      );
      const bagPrice = res.data;
      setSubtotal(bagPrice.subtotal);
      setTotal(bagPrice.total);
    } catch (error) {
      console.error("Error updating quantity:", error);
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
                      src={`http://192.168.1.10:9080/api/v1/product/product-photo/${item.product._id}`}
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
          </div>

          <div className="sb-order-summary">
            <div className="sb-order-summary-container">
              <div className="sb-os-title">
                <h4>Order Summary</h4>
              </div>
              <div className="sb-os-subtotal">
                <p>Subtotal ({bag.length} items)</p>
                <p>$ {subtotal}</p>
              </div>
              <div className="sb-os-shipping">
                <p>Estimated Shipping </p>
                <p>$ 5</p>
              </div>
              <div className="sb-os-discount">
                <p>Discount</p>
                <p>$ 0</p>
              </div>

              <div className="sb-os-voucher">
                <input
                  type="text"
                  name="voucher"
                  placeholder="Enter Voucher Code"
                  required
                  className="sb-os-voucher-input"
                />
                <button className="sb-os-voucher-apply-btn">Apply</button>
              </div>
              <div className="sb-os-total">
                <p>Total</p>
                <p>$ {total}</p>
              </div>
              <div className="sb-os-checkout">
                <button className="sb-os-checkout-btn sb-os-voucher-apply-btn">
                  Checkout ({bag.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShoppingBag;
