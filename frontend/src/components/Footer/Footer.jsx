import React from "react";
import "./Footer.css";

import Esewa from "../../assets/e_sewa.png";
import Khalti from "../../assets/khalti.png";

import {
  FaDiscord,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="Footer">
      <div className="footer-container footer-flex">
        <div className="footer-content footer-flex">
          <div className="footer-right footer-flex">
            <div className="footer-right-item footer-flex">
              <div className="footer-content-title">
                <h3>LynxLine</h3>
              </div>
              <div className="footer-links footer-flex">
                <ul>
                  <li className="footer-link footer-links-lynxline">
                    <a href="/">About LynxLine</a>
                  </li>
                  <li className="footer-link footer-links-lynxline">
                    <a href="/">Careers</a>
                  </li>
                  <li className="footer-link footer-links-lynxline">
                    <a href="/">Terms & Conditions</a>
                  </li>
                  <li className="footer-link footer-links-lynxline">
                    <a href="/">Privacy Policy</a>
                  </li>
                  <li className="footer-link footer-links-lynxline">
                    <a href="/">Return Policy</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-right-item footer-flex">
              <div className="footer-content-title">
                <h3>Pages</h3>
              </div>
              <div className="footer-links footer-flex">
                <ul>
                  <li className="footer-link footer-links-pages">
                    <a href="/">Mens</a>
                  </li>
                  <li className="footer-link footer-links-pages">
                    <a href="/">Womens</a>
                  </li>
                  <li className="footer-link footer-links-pages">
                    <a href="/">Accesories</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-right-item footer-flex">
              <div className="footer-content-title">
                <h3>Help</h3>
              </div>
              <div className="footer-links footer-flex">
                <ul>
                  <li className="footer-link footer-links-help">
                    <a href="/">Contact Us</a>
                  </li>
                  <li className="footer-link footer-links-help">
                    <a href="/">Returns</a>
                  </li>
                  <li className="footer-link footer-links-help">
                    <a href="/">Orders</a>
                  </li>
                  <li className="footer-link footer-links-help">
                    <a href="/auth/reset-password">Reset Password</a>
                  </li>
                  <li className="footer-link footer-links-help">
                    <a href="/auth/forgot-password">Forgot Password</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-left">
            <h3>Ya Kei ta halne ho k halne sochna sakina</h3>
          </div>
        </div>
        <div className="footer-small footer-flex">
          <div className="footer-small-left footer-flex">
            <div className="footer-small-img">
              <img src={Esewa} alt="" />
            </div>
            <div className="footer-small-img">
              <img src={Khalti} alt="" />
            </div>
          </div>
          <div className="footer-small-right footer-flex">
            <div>
              <a href="/" className="footer-small-icon">
                <FaDiscord />
              </a>
            </div>
            <div>
              <a href="/" className="footer-small-icon">
                <FaFacebookF />
              </a>
            </div>
            <div>
              <a href="/" className="footer-small-icon">
                <FaYoutube />
              </a>
            </div>
            <div>
              <a href="/" className="footer-small-icon">
                <FaInstagram />
              </a>
            </div>
            <div>
              <a href="/" className="footer-small-icon">
                <FaXTwitter />
              </a>
            </div>
            <div>
              <a href="/" className="footer-small-icon">
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-down">
        <div className="footer-copyright">
          © 2024 | LynxLine Limited | All rights reserved | Unleash Your Inner
          Beast
        </div>
      </div>
    </div>
  );
};

export default Footer;
