import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "./StaticPages.css";

const PrivacyPolicy = () => {
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
    <Layout title={"Privacy Policy - LynxLine"}>
      <div className="Terms-And-Condition Static-Page-2">
        <div className="home-offer">
          <h4 className="home-offer-text">{offers[offerIndex]}</h4>
        </div>
        <div className="tac-container">
          <div className="tac-title">
            <h1>Privacy Policy</h1>
            <p>Last updated: 07 Jul 2024</p>
          </div>

          <div className="tac-body">
            <p>
              LynxLine is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website{" "}
              <a href="/" className="static-links-blue">
                www.lynxline.com
              </a>
              , including any other media form, media channel, mobile website,
              or mobile application related or connected thereto (collectively,
              the "Site"). Please read this privacy policy carefully. If you do
              not agree with the terms of this privacy policy, please do not
              access the site.
              <br />
              <br />
              <strong>1. Information We Collect</strong>
              <br />
              <br />
              We may collect personal information from you when you interact
              with our Site, such as when you:
              <br />
              <br />
              <li>Register for an account</li>
              <br />
              <li>Make a purchase</li>
              <br />
              <li>Contact us with inquiries or customer support requests</li>
              <br />
              <li>Participate in surveys or promotions</li>
              <br />
              <strong>
                The types of personal information we may collect include:
              </strong>
              <br />
              <br />
              <li>Name</li>
              <br />
              <li>
                Contact information (email address, phone number, shipping
                address)
              </li>
              <br />
              <li>Preferences and interests</li>
              <br />
              <li>And only those information you shares with us</li>
              <br />
              <strong>2. How We Use Your Information</strong>
              <br />
              <br />
              We may use the information we collect from you in the following
              ways:
              <br />
              <br />
              <li>To process and fulfill your orders and transactions</li>
              <br />
              <li>
                To communicate with you, including sending order confirmations,
                updates, and promotional emails
              </li>
              <br />
              <li>To improve our products and services</li>
              <br />
              <li>To personalize your experience on our Site</li>
              <br />
              <li>To respond to your inquiries and provide customer support</li>
              <br />
              <strong>3. Disclosure of Your Information</strong>
              <br />
              <br />
              We do not sell, trade, or otherwise transfer your personal
              information to outside parties without your consent.
              <br />
              <br />
              <strong>4. Security of Your Information</strong>
              <br />
              <br />
              We implement appropriate technical and organizational security
              measures to protect your personal information from unauthorized
              access, use, or disclosure.
              <br />
              <br />
              <strong>5. Changes to This Privacy Policy</strong>
              <br />
              <br />
              We may update this Privacy Policy from time to time in order to
              reflect changes to our practices or for other operational, legal,
              or regulatory reasons.
              <br />
              <br />
              <h3>Contact</h3>
              <br />
              If you have any questions about these Privacy Policies, please
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

export default PrivacyPolicy;
