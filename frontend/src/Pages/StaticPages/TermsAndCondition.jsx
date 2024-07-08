import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "./StaticPages.css";

const TermsAndCondition = () => {
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
    <Layout title={"Terms & Conditions - LynxLine"}>
      <div className="Terms-And-Condition Static-Page-2">
        <div className="home-offer">
          <h4 className="home-offer-text">{offers[offerIndex]}</h4>
        </div>
        <div className="tac-container">
          <div className="tac-title">
            <h1>Terms & Condition</h1>
            <p>Last updated: 06 Jul 2024</p>
          </div>

          <div className="tac-body">
            <p>
              Welcome to LynxLine!
              <br />
              <br />
              These terms and conditions outline the rules and regulations for
              the use of LynxLine's website, located at{" "}
              <a href="/" className="static-links-blue">
                www.lynxline.com
              </a>
              <br />
              <br />
              By accessing this website we assume you accept these terms and
              conditions. Do not continue to use LynxLine if you do not agree to
              take all of the terms and conditions stated on this page.
              <br />
              <br />
              <strong>1. Introduction</strong>
              <br />
              <br />
              These Terms and Conditions govern your use of our website,
              products, and services. By using our website, you accept these
              Terms and Conditions in full. If you disagree with these Terms and
              Conditions or any part of these Terms and Conditions, you must not
              use our website.
              <br />
              <br />
              <strong>2. Intellectual Property Rights</strong>
              <br />
              <br />
              Unless otherwise stated, LynxLine and/or its licensors own the
              intellectual property rights for all material on LynxLine. All
              intellectual property rights are reserved. You may access this
              from LynxLine for your own personal use subjected to restrictions
              set in these terms and conditions.
              <br />
              <br />
              <strong>3. Restrictions</strong>
              <br />
              <br />
              You are specifically restricted from all of the following: <br />
              <br />
              <li>
                Selling, sublicensing, and/or otherwise commercializing any
                website material.
              </li>
              <br />
              <li>
                Using this website in any way that is or may be damaging to this
                website.
              </li>
              <br />
              <li>
                Using this website in any way that impacts user access to this
                website.
              </li>
              <br />
              <li>
                Using this website contrary to applicable laws and regulations,
                or in any way may cause harm to the website, or to any person or
                business entity.
              </li>
              <br />
              <li>
                Engaging in any data mining, data harvesting, data extracting,
                or any other similar activity in relation to this website.
              </li>
              <br />
              <li>
                Using this website to engage in any advertising or marketing.
              </li>
              <br />
              <strong>4. Your Privacy</strong>
              <br />
              <br />
              Please read our{" "}
              <a href="/article/privacy-policy" className="static-links-blue">
                Privacy Policy.
              </a>{" "}
              <br />
              <br />
              <strong>5. Products and Services</strong>
              <br />
              <br />
              <li>
                All products displayed on the website are subject to
                availability.
              </li>
              <br />
              <li>
                Prices for our products are subject to change without notice.
              </li>
              <br />
              <li>
                We reserve the right at any time to modify or discontinue the
                service (or any part or content thereof) without notice at any
                time.
              </li>
              <br />
              <li>
                We shall not be liable to you or to any third-party for any
                modification, price change, suspension, or discontinuance of the
                service.
              </li>
              <br />
              <strong>6. Order Acceptance</strong>
              <br />
              <br />
              <li>
                Once you place an order with us, you will receive an email
                acknowledging receipt of your order. This email is only an
                acknowledgment and does not constitute acceptance of your order.
              </li>
              <br />
              <li>
                A contract between us for the purchase of goods will not be
                formed until your payment has been approved by us and we have
                debited your credit or debit card.
              </li>
              <br />
              <strong>7. Payment</strong>
              <br />
              <br />
              <li>
                All payments must be made at the time of placing the order.
              </li>
              <br />
              <li>
                Payment can be made by credit or debit card, or any other
                payment method specified on the website.
              </li>
              <br />
              <strong>8. Shipping and Delivery</strong>
              <br />
              <br />
              <li>
                We aim to dispatch all orders within 2-3 business days.
                Estimated delivery times are to be used as a guide only and
                commence from the date of dispatch.
              </li>
              <br />
              <li>
                We are not responsible for any delays caused by destination
                customs clearance processes.
              </li>
              <br />
              <strong>9. Limitation of Liability</strong>
              <br />
              <br />
              To the fullest extent permitted by law, LynxLine shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use,
              goodwill, or other intangible losses, resulting from <br /> (i)
              your use or inability to use our services; <br /> (ii) any
              unauthorized access to or use of our servers and/or any personal
              information stored therein.
              <br />
              <br />
              <strong>10. Changes to Terms and Conditions</strong>
              <br />
              <br />
              We reserve the right, at our sole discretion, to update, change or
              replace any part of these Terms and Conditions by posting updates
              and changes to our website. It is your responsibility to check our
              website periodically for changes. Your continued use of or access
              to our website or the service following the posting of any changes
              to these Terms and Conditions constitutes acceptance of those
              changes. <br />
              <br />
              <br />
              <h3>Contact</h3>
              <br />
              If you have any questions about these Terms and Conditions, please
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

export default TermsAndCondition;
