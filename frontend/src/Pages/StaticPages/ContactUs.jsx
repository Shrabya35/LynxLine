import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "./StaticPages.css";

const ContactUs = () => {
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
            <h1>Contact Us</h1>
            <p>Last updated: 07 Jul 2024</p>
          </div>

          <div className="tac-body">
            <p>
              We always strive to make your experience with LynxLine as seamless
              and enjoyable as possible. While we may not have a clickable chat
              button like some other websites, our contact process is designed
              to be just as straightforward and efficient, ensuring you can
              easily reach us whenever you need assistance.
              <br />
              <br />
              <strong>Career Enquiries:</strong> <br />
              <br />
              Are you interested in joining the LynxLine team? We are always on
              the lookout for talented and passionate individuals who want to
              make a difference. Whether you're looking to start a career in the
              fitness industry or bring your expertise to our growing company,
              we'd love to hear from you. For all career-related enquiries,
              please email us at:{" "}
              <a href="/profile" className="about-page-strong-link">
                career@lynxline.com
              </a>{" "}
              <br />
              <br />
              <strong>General Business Enquiries:</strong> <br />
              <br />
              Do you have a business proposal, partnership opportunity, or any
              other general business-related questions? We value your interest
              and are eager to explore potential collaborations that align with
              our mission and values. For all general business enquiries, please
              email us at:{" "}
              <a href="/profile" className="about-page-strong-link">
                business@lynxline.com
              </a>
              <br />
              <br />
              <strong>Customer Support:</strong>
              <br />
              <br />
              If you need assistance with an order, have a question about our
              products, or require any other customer service support, please do
              not hesitate to reach out. Our customer service team is dedicated
              to providing you with the help you need in a timely and effective
              manner. You can reach our customer support team by emailing:{" "}
              <a href="/profile" className="about-page-strong-link">
                support@lynxline.com
              </a>
            </p>
            <br />
            <br />
            <br />
            <h3>HOW TO CONTACT LYNXLINE BY EMAIL?</h3>
            <br />
            <p>
              If you’d prefer to email us, please send your email to
              support@lynxline.com. We typically aim to get back to you within
              24-48 hours. <br />
              <br />
              To help us assist you as quickly as possible, please include the
              following information in your email: <br />
              <br />
              <li>Order number(eg. #123456)</li>
              <br />
              <li>Your email address</li>
              <br />
              <li>A detailed description of your issue</li>
              <br />
              <li>Supporting images (if applicable)</li>
              <br />
              Providing this information will allow us to answer your questions
              efficiently. You can expect a reply within 24 hours, except during
              busy sale periods, when it may take slightly longer.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
