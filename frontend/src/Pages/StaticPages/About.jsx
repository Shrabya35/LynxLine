import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "./StaticPages.css";

import AboutImg1 from "../../assets/about-1.png";
import AboutImg2 from "../../assets/about-2.png";
import AboutImg3 from "../../assets/about-3.png";

const About = () => {
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
    <Layout title={"About - LynxLine"}>
      <div className="About Static-Page-1">
        <div className="home-offer">
          <h4 className="home-offer-text">{offers[offerIndex]}</h4>
        </div>
        <div className="about-container">
          <div className="about-us-section about-page-section">
            <div className="about-us-section-left about-us-section-text">
              <h2>About Us</h2>
              <p>
                We are LynxLine. Our mission is to bring together the
                conditioning* community.
                <br /> <br />
                It's not the goals that unite us, but the shared journey to
                achieve them. Despite our varied training environments and
                ultimate objectives, the dedication and effort we put in is what
                binds us. We are a collective of individuals who believe that we
                can achieve more together than alone.
                <br /> <br />
                Our story began in 2023, in a small garage in Biratnagar, Nepal,
                armed with just a sewing machine, a screen printer, and dreams
                that seemed too big. Today, we design the gear that helps
                everyone strive for their best: the clothing you'll wear through
                every workout, the content that inspires you, and the community
                where you can thrive.
                <br /> <br />
                Our LynxLine family is small but growing, with our first few
                hundred customers already supporting us through our initial
                online store. As we continue to expand, we are building our team
                and establishing our first offices, starting locally and aiming
                to grow globally. Our team of over 3 employees spans five
                country, including offices in Nepal, Wales, Bhutan, Brazil, and
                Cyprus.
                <br /> <br />
                <strong>
                  *Conditioning encompasses all the efforts we make today to be
                  ready for tomorrow.
                </strong>
              </p>
              <div className="about-us-section-left-bottom">
                <h3>LynxLine IS LED BY:</h3>
                <li>
                  <strong>Shrabya </strong>- Founder & Chief Executive Officer
                </li>
                <li>
                  <strong>Binod </strong>- Chief Financial Officer
                </li>
                <li>
                  <strong>Banrakas </strong>- Chief Brand Officer
                </li>
              </div>
            </div>
            <div className="about-us-section-right about-us-section-image">
              <img src={AboutImg1} alt="about-img-1" />
            </div>
          </div>
          <div className="about-core-value  about-page-section">
            <div className="about-us-section-right about-us-section-image">
              <img src={AboutImg2} alt="about-img-2" />
            </div>
            <div className="about-us-section-left about-us-section-text">
              <h2>Our Core Value</h2>
              <div className="about-us-core-values">
                <p>
                  Our principles are priceless. Losing them means losing our
                  foundation.
                </p>
                <h4>STAY AUTHENTIC.</h4>
                <p>
                  At LynxLine, being approachable, inclusive, and modest is in
                  our DNA.
                </p>
                <h4>CARE DEEPLY.</h4>
                <p>
                  We prioritize awareness of our environment, support those
                  around us, and take proactive steps to foster positive change.
                </p>
                <h4>ACT WITH INTEGRITY.</h4>
                <p>
                  You can rely on us to be honest, trustworthy, and sincere.
                </p>
                <h4>EMBRACE THE LynxLine SPIRIT.</h4>
                <p>
                  Never forget the drive and mindset that started in our garage:
                  ambitious, flexible, and innovative.
                </p>
                <h4>PRIORITIZE FAMILY.</h4>
                <p>Always and without exception.</p>
              </div>
            </div>
          </div>
          <div className="about-us-section about-page-section">
            <div className="about-get-in-touch-left  about-us-section-left about-us-section-text">
              <h2>Get In Touch</h2>
              <p>
                For Career enquiries please email:
                <br />
                <a href="/profile" className="about-page-strong-link">
                  career@lynxline.com
                </a>
                <br /> <br />
                For General Business enquiries please email:
                <br />
                <a href="/profile" className="about-page-strong-link">
                  business@lynxline.com
                </a>
                <br /> <br />
                For all customer service enquiries please{" "}
                <a href="/profile" className="about-page-strong-link">
                  Contact Us
                </a>
              </p>
            </div>
            <div className="about-us-section-right about-us-section-image">
              <img src={AboutImg3} alt="about-img-3" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
