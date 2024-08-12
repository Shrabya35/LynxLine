import React from "react";
import "./Checkout.css";
import CheckoutSucc from "../../assets/success.svg";

const CheckoutSuccess = () => {
  return (
    <div className="Checkout-Err">
      <div className="checkout-err-container checkout-flex">
        <div className="checkout-err-img">
          <img src={CheckoutSucc} alt="checkout-err" />
        </div>
        <h3 className="order-success-text">Thank You For Ordering!</h3>
        <div className="checkout-err-text">
          Your Order has been placed successfully. Thanks for choosing us , now
          we would appreciate if you wait patiently for few days to recieve
          order. you can check your order status from
        </div>
        <a href="/profile/user" className="checkout-err-a">
          Your Profile
        </a>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
