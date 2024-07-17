import React from "react";
import CheckoutPage from "../Pages/Checkout/CheckoutPage";
import CheckoutErr from "../Pages/Checkout/CheckoutErr";

const CheckoutRoute = () => {
  const storedToken = sessionStorage.getItem("checkoutToken");

  if (!storedToken) {
    return <CheckoutErr />;
  }

  return <CheckoutPage />;
};

export default CheckoutRoute;
