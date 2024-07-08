import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "./StaticPages.css";

const OrderGuide = () => {
  const [offerIndex, setOfferIndex] = useState(0);

  const offers = [
    "🎉 Shop over $75 & enjoy FREE delivery🚚💰",
    "🌟 Discover our exclusive deals & discounts this month! 💸✨",
    "💳 Get 20% off on your purchase with code BLACKNIGGA 💳🛍️",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [offers.length]);

  return (
    <Layout title={"Order Guide - LynxLine"}>
      <div className="Terms-And-Condition Static-Page-2">
        <div className="home-offer">
          <h4 className="home-offer-text">{offers[offerIndex]}</h4>
        </div>
        <div className="tac-container">
          <div className="tac-title">
            <h1>Order Guide</h1>
            <p>Last updated: 07 Jul 2024</p>
          </div>

          <div className="tac-body">
            <p>
              Placing an order on LynxLine is quick and easy. Follow these steps
              to ensure a smooth shopping experience:
              <br />
              <br />
              <strong>1. Browse and Search for Products:</strong> <br />
              <br />
              <li>
                Explore our website by scrolling through the various categories
                or using the search bar to find specific items.
              </li>
              <br />
              <strong>2. Select and Add to Cart:</strong> <br />
              <br />
              <li>Click on the product you love to view its details.</li>
              <br />
              <li>
                Click "Add to Bag" to include the item in your shopping bag.
              </li>
              <br />
              <strong>3. Review Your Cart:</strong> <br />
              <br />
              <li>Go to the cart section by clicking on the cart icon.</li>
              <br />
              <li>Set the quantity you want to buy for each item.</li>
              <br />
              <li>Ensure all selected items are correct before proceeding.</li>
              <br />
              <strong>4. Checkout Process:</strong>
              <br />
              <br />
              <li>Click "Checkout" to proceed with your purchase.</li>
              <br />
              <li>
                Fill in all required fields, including shipping information and
                payment details.
              </li>
              <br />
              <li>Review your order summary and submit your order.</li>
              <br />
              <strong>5. Order Confirmation:</strong> <br />
              <br />
              <li>
                After completing your purchase, you will receive an order
                confirmation email.
              </li>
              <br />
              <li>
                This email will contain your order details and tracking
                information.
              </li>
              <br />
              <strong>6. Track Your Order:</strong>
              <br />
              <br />
              <li>
                Proceed in to your profile to track the status of your order.
              </li>
              <br />
              By following these steps, you can enjoy a hassle-free shopping
              experience on LynxLine. If you have any questions or need further
              assistance, please do not hesitate to contact our support team at{" "}
              <a href="/profile" className="about-page-strong-link">
                support@lynxline.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderGuide;
