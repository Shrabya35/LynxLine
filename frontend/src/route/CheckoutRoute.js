import React from "react";
import CheckoutPage from "../Pages/Checkout/CheckoutPage";
import CheckoutErr from "../Pages/Checkout/CheckoutErr";
import CheckoutSuccess from "../Pages/Checkout/CheckoutSuccess";

const CheckoutRoute = () => {
  const storedToken = sessionStorage.getItem("checkoutToken");
  const successToken = sessionStorage.getItem("successToken");

  if (!storedToken && !successToken) {
    return <CheckoutErr />;
  } else if (successToken && !storedToken) {
    return <CheckoutSuccess />;
  }
  return <CheckoutPage />;
};

export default CheckoutRoute;
