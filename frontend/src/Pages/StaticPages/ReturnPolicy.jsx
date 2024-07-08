import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "./StaticPages.css";

const ReturnPolicy = () => {
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
    <Layout title={"Return Policy - LynxLine"}>
      <div className="Terms-And-Condition Static-Page-2">
        <div className="home-offer">
          <h4 className="home-offer-text">{offers[offerIndex]}</h4>
        </div>
        <div className="tac-container">
          <div className="tac-title">
            <h1>Return Policy</h1>
            <p>Last updated: 07 Jul 2024</p>
          </div>

          <div className="tac-body">
            <p>
              At LynxLine, we strive to ensure your complete satisfaction with
              every purchase. If you are not entirely satisfied with your
              purchase, we're here to help.
              <br />
              <br />
              <strong>1. Return Eligibility</strong>
              <br />
              <br />
              Returns are accepted only under the following conditions:
              <br />
              <br />
              <li>
                Returns can only be made at our offline stores or our branch
                headquarters.
              </li>
              <br />
              <li>The return must be initiated within 7 days of delivery.</li>
              <br />
              <li>
                The product must be in its original condition, without any
                damage or signs of wear and tear.
              </li>
              <br />
              <li>Returns due to a change of mind will not be accepted.</li>
              <br />
              <strong>2. Valid Reasons for Returns</strong>
              <br />
              <br />
              Returns will only be accepted for the following valid reasons:
              <br />
              <br />
              <li>
                If you received a different product than what you ordered.
              </li>
              <br />
              <li>If the product arrived damaged or defective.</li>
              <br />
              <li>
                {" "}
                If there are any other substantial issues with the order.
              </li>
              <br />
              <strong>3. Return Process</strong>
              <br />
              <br />
              To initiate a return, please follow these steps:
              <br />
              <br />
              <strong>I.</strong> Visit one of our offline stores or our branch
              headquarters with the product and proof of purchase.
              <br />
              <br />
              <strong>II.</strong> Explain the reason for the return to our
              staff.
              <br /> <br />
              <strong>III.</strong> Our team will inspect the product to ensure
              it meets the return criteria.
              <br />
              <br />
              <strong>4. Refunds</strong>
              <br />
              <br />
              Once your return is approved, we will process your refund. Refunds
              will be issued to the original method of payment.
              <br />
              <br />
              <h3>Contact</h3>
              <br />
              If you have any questions about these Return Policies, please
              contact us at{" "}
              <a href="/" className="static-links-blue">
                support@lynxline.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnPolicy;
