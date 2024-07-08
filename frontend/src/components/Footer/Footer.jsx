import React from "react";
import "./Footer.css";

import Esewa from "../../assets/e_sewa.png";
import Khalti from "../../assets/khalti.png";
import QrCode from "../../assets/qrcode.png";
import Nepal from "../../assets/nepal.png";
import Wales from "../../assets/wales.png";
import Bhutan from "../../assets/bhutan.png";
import Brazil from "../../assets/brazil.png";
import Cyprus from "../../assets/cyprus.png";

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
                    <a href="/article/about">About LynxLine</a>
                  </li>
                  <li className="footer-link footer-links-lynxline">
                    <a href="/article/terms-and-condition">
                      Terms & Conditions
                    </a>
                  </li>
                  <li className="footer-link footer-links-lynxline">
                    <a href="/article/privacy-policy">Privacy Policy</a>
                  </li>
                  <li className="footer-link footer-links-lynxline">
                    <a href="/article/return-policy">Return Policy</a>
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
                    <a href="/men">Mens</a>
                  </li>
                  <li className="footer-link footer-links-pages">
                    <a href="/women">Womens</a>
                  </li>
                  <li className="footer-link footer-links-pages">
                    <a href="/accessories">Accesories</a>
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
                    <a href="/article/contact-us">Contact Us</a>
                  </li>
                  <li className="footer-link footer-links-help">
                    <a href="/article/order-guide">Order</a>
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
          <div className="footer-left footer-flex">
            <div className="footer-left-flag footer-right-item footer-flex">
              <div className="footer-content-title">
                <h3>LynxLine Global</h3>
              </div>
              <div className="footer-flags footer-flex">
                <ul>
                  <li className="footer-global footer-link footer-links-pages">
                    <img className="footer-flag" src={Nepal} alt="wales" />
                    <p>Nepal</p>
                  </li>
                  <li className="footer-global footer-link footer-links-pages">
                    <img className="footer-flag" src={Wales} alt="wales" />
                    <p>Wales</p>
                  </li>
                  <li className="footer-global footer-link footer-links-pages">
                    <img className="footer-flag" src={Bhutan} alt="wales" />
                    <p>Bhutan</p>
                  </li>
                  <li className="footer-global footer-link footer-links-pages">
                    <img className="footer-flag" src={Brazil} alt="wales" />
                    <p>Brazil</p>
                  </li>
                  <li className="footer-global footer-link footer-links-pages">
                    <img className="footer-flag" src={Cyprus} alt="wales" />
                    <p>Cyprus</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-left-qr footer-right-item footer-flex">
              <div className="footer-content-title">
                <h3>Scan For More :</h3>
              </div>
              <div className="footer-qr-img">
                <img src={QrCode} alt="qrcode" />
              </div>
            </div>
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
