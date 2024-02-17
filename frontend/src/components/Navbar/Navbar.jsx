import React, { useState } from "react";
import "./Navbar.css";
import NavLogo from "../../assets/logo.png";

import { IoSearchOutline, IoClose } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { LuUser } from "react-icons/lu";
import { HiShoppingBag } from "react-icons/hi2";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="Navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <a href="/">
            <img src={NavLogo} alt="" />
          </a>
          <h1 class="logo-name">LynxLine</h1>
        </div>
        <div className="nav-menu">
          <li className="nav-items">
            <a href="/">Men</a>
          </li>
          <li className="nav-items">
            <a href="/about">Women</a>
          </li>
          <li className="nav-items">
            <a href="/about">Accesories</a>
          </li>
        </div>
        <div className="nav-user">
          <IoMdMenu className="nav-userItems nav-toggle" onClick={toggleMenu} />
          <IoSearchOutline className="nav-userItems nav-search" />
          <FaRegHeart className="nav-userItems nav-wishlist" />
          <a href="/auth" target="_" className="nav-userItems nav-account">
            <LuUser />
          </a>
          <HiShoppingBag className="nav-userItems nav-shopping" />
        </div>
        <div className="nav-user-mob">
          <a href="/auth" className="nav-user-account-mob">
            <LuUser />
          </a>
          <HiShoppingBag className=" nav-shopping-mob" />
        </div>
      </div>
      <div className={`nav-sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="nav-mob-up">
          <div className="nav-mob-icon">
            <IoClose className="close-btn" onClick={closeMenu} />
            <FaRegHeart className="mob-wishlist" />
          </div>
          <div className="nav-mob-cont">
            <div className="sidebar-title">SHOP</div>
            <div className="nav-mob-search">
              <IoSearchOutline className="nav-mob-search-icon" />
              <input
                type="text"
                className="nav-mob-search-input"
                placeholder="Search for a Product"
              />
            </div>
          </div>
        </div>
        <div className="sidebar-menu">
          <li className="nav-items-mob">
            <a href="/">Men</a>
          </li>
          <li className="nav-items-mob">
            <a href="/about">Women</a>
          </li>
          <li className="nav-items-mob">
            <a href="/about">Accesories</a>
          </li>
          <li className="nav-items-mob">
            <a href="/about">My Cart</a>
          </li>
          <li className="nav-items-mob">
            <a href="/about">My Wishlist</a>
          </li>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
