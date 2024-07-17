import React, { useState, useEffect, useMemo } from "react";
import "./Checkout.css";
import { Helmet } from "react-helmet";
import { IoInformationCircleOutline, IoClose } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

import { Select } from "antd";
const { Option } = Select;

const CheckoutPage = ({ description, keywords, author }) => {
  const [country, setCountry] = useState("");
  const [addressLine1, setAdressLine1] = useState("");
  const [addressLine2, setAdressLine2] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [bag, setBag] = useState([]);
  const [subtotal, setSubtotal] = useState("");
  const [shippingFee, setShippingFee] = useState("");
  const [total, setTotal] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const [bagLoading, setBagLoading] = useState(true);
  const [showPopups, setShowPopups] = useState({
    popups1: true,
    popups2: true,
  });
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const closePopups = (id) => {
    setShowPopups((prevShowPopups) => ({
      ...prevShowPopups,
      [id]: false,
    }));
  };

  const userDetailsString = useMemo(
    () =>
      localStorage.getItem("userDetails") ||
      sessionStorage.getItem("userDetails"),
    []
  );

  const LocalStorageUserDetails = useMemo(
    () => JSON.parse(userDetailsString),
    [userDetailsString]
  );
  const userEmail = LocalStorageUserDetails?.email;

  useEffect(() => {
    const fetchBag = async () => {
      try {
        const bagResponse = await axios.get(
          `${baseUrl}/user/shoppingBag/${userEmail}`
        );
        const bagData = bagResponse.data;
        setBag(bagData.shoppingBag);
        setBagLoading(false);
      } catch (error) {
        toast.error("Failed to chekout your order");
        setBagLoading(false);
        console.error("Error checking wishlist:", error);
      }
    };

    fetchBag();
  }, [baseUrl, userEmail]);

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
        setShippingFee(bagPrice.shippingFee);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    fetchPrice();
  }, [baseUrl, userEmail]);

  return (
    <div className="Checkout">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta charSet="utf-8" />
        <title>Checkout - LynxLine</title>
      </Helmet>
      <div className="checkout-page-top">
        <h2>LynxLine</h2>
      </div>
      <div className="checkout-container">
        <div className="checkout-container-left ">
          <div className="checkout-left-container checkout-flex">
            <div className="checkout-container-popups checkout-flex">
              <div
                id="popups1"
                className={`checkout-popups-card checkout-flex ${
                  showPopups.popups1 ? "" : "close"
                }`}
              >
                <div className="checkout-popups-card-top">
                  <div className="checkout-popups-card-top-left">
                    <IoInformationCircleOutline className="checkout-popups-icon-info" />
                    <h4>Cash On Delivery </h4>
                  </div>
                  <IoClose
                    className="checkout-popups-icon-cross"
                    onClick={() => closePopups("popups1")}
                  />
                </div>
                <div className="checkout-popups-card-bottom">
                  <p>
                    We currently offer cash on delivery only. We appreciate your
                    understanding as we are expanding our payment options.
                  </p>
                </div>
              </div>
              <div
                id="popups2"
                className={`checkout-popups-card checkout-flex ${
                  showPopups.popups2 ? "" : "close"
                }`}
              >
                <div className="checkout-popups-card-top">
                  <div className="checkout-popups-card-top-left">
                    <IoInformationCircleOutline className="checkout-popups-icon-info" />
                    <h4>Possible Order Delay</h4>
                  </div>
                  <IoClose
                    className="checkout-popups-icon-cross"
                    onClick={() => closePopups("popups2")}
                  />
                </div>
                <div className="checkout-popups-card-bottom">
                  <p>
                    Sometimes order may experience delays. We appreciate your
                    patience as we work to fulfill them.
                  </p>
                </div>
              </div>
            </div>
            <div className="checkout-container-account checkout-flex">
              <p className="checkout-account-title">Account</p>
              <p className="checkout-account-email">{userEmail}</p>
            </div>
            <div className="checkout-container-delivery checkout-flex">
              <h3>Delivery</h3>
              <form
                action="POST"
                className="checkout-container-delivery-form checkout-flex"
              >
                <Select
                  id="country-select"
                  bordered={true}
                  placeholder="Country/Region"
                  size="large"
                  showSearch
                  className="checkout-form-select"
                  value={country || undefined}
                  onChange={(value) => {
                    setCountry(value);
                  }}
                  name="country"
                >
                  <Option value="Nepal">Nepal</Option>
                  <Option value="Wales">Wales</Option>
                  <Option value="Bhutan">Bhutan</Option>
                  <Option value="Brazil">Brazil</Option>
                  <Option value="Cyprus">Cyprus</Option>
                </Select>
                <div className="checkout-form-section">
                  <input
                    className="checkout-form-input"
                    type="text"
                    name="addressLine1"
                    value={addressLine1}
                    onChange={(e) => setAdressLine1(e.target.value)}
                    placeholder="Adress Line 1"
                    required
                  />
                </div>
                <div className="checkout-form-section">
                  <input
                    className="checkout-form-input"
                    type="text"
                    name="addressLine2"
                    value={addressLine2}
                    onChange={(e) => setAdressLine2(e.target.value)}
                    placeholder="Adress Line 2"
                  />
                </div>
                <div className="checkout-form-section checkout-form-section-2">
                  <input
                    className="checkout-form-input"
                    type="text"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    required
                  />
                  <input
                    className="checkout-form-input"
                    type="text"
                    name="zipcode"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    placeholder="Zipcode"
                    required
                  />
                </div>
                <button type="submit" className="checkout-order-btn">
                  Place Order
                </button>
                <p className="checkout-order-btn-msg">
                  By placing your order you agree to LynxLine's{" "}
                  <a
                    className="checkout-order-btn-msg-a"
                    href="/article/terms-and-condition"
                  >
                    Terms and Conditions
                  </a>
                  ,{" "}
                  <a
                    className="checkout-order-btn-msg-a"
                    href="/article/privacy-policy"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    className="checkout-order-btn-msg-a"
                    href="/article/return-policy"
                  >
                    Return Policy
                  </a>{" "}
                </p>
              </form>
            </div>
          </div>
        </div>
        <div className="checkout-container-right">
          <div className="checkout-right-container checkout-flex">
            <h3 className="checkout-right-title"> Order Summary</h3>
            <div className="checkout-items-section checkout-flex">
              {bagLoading && <p>Loading...</p>}
              {bag.map((item) => (
                <div
                  className="sb-product-card checkout-product-card"
                  key={item.product._id}
                >
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="checkout-relative"
                  >
                    <img
                      src={`${baseUrl}/product/product-photo/${item.product._id}`}
                      className="sb-product-card-img checkout-product-img"
                      alt={item.product.name}
                    />
                    <span className="checkout-item-count">{item.quantity}</span>
                  </Link>
                  <div className="sb-product-card-body checkout-product-body">
                    <p className="sb-product-card-title checkout-product-title">
                      {item.product.name}
                    </p>
                    <div className="sb-product-card-mid">
                      <p className="sb-product-card-price checkout-product-price">
                        ${item.product.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout-order-summary checkout-flex">
              <div className="sb-os-subtotal">
                <p>Subtotal ({totalItems} items)</p>
                <p>$ {subtotal}</p>
              </div>
              <div className="sb-os-shipping">
                <p>Estimated Shipping </p>
                {subtotal === 0 ? <p>$ {subtotal}</p> : <p>$ {shippingFee}</p>}
              </div>
              <div className="sb-os-total">
                <h4>Total</h4>
                {subtotal === 0 ? <p>$ {subtotal}</p> : <h4>$ {total}</h4>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

CheckoutPage.defaultProps = {
  title: "LynxLine - Unleash Your Inner Beast",
  description: "Official Store of LynxLine",
  keywords: "LynxLine,Sports wear, gym wears",
  author: "LynxLine CO.",
};

export default CheckoutPage;
