import React from "react";
import "./Checkout.css";
import NoCheckout from "../../assets/No-filter-Results.svg";

const CheckoutErr = () => {
  return (
    <div className="Checkout-Err">
      <div className="checkout-err-container checkout-flex">
        <div className="checkout-err-img">
          <img src={NoCheckout} alt="checkout-err" />
        </div>
        <div className="checkout-err-text">
          Sorry, something went wrong on our side. Please go back to cart and
          try again.
        </div>
        <a href="/shopping-bag" className="checkout-err-a">
          Go Back To Cart
        </a>
      </div>
    </div>
  );
};

export default CheckoutErr;
