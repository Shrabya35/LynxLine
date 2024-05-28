import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import NavLogo from "../../assets/logo.png";

import { IoSearchOutline, IoClose } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { LuUser } from "react-icons/lu";
import { HiShoppingBag } from "react-icons/hi2";
import toast, { Toaster } from "react-hot-toast";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(token ? true : false);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };
  const handleWishlist = () => {
    toast.error("Sign in to save and view your wishlist");
  };

  return (
    <nav className="Navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <a href="/">
            <img src={NavLogo} alt="" />
            <h1 className="logo-name">LynxLine</h1>
          </a>
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
          <IoSearchOutline />

          {isLoggedIn ? (
            <Link to="/wishlist" className="nav-userItems nav-wishlist">
              <FaRegHeart />
            </Link>
          ) : (
            <FaRegHeart
              className="nav-userItems nav-wishlist"
              onClick={handleWishlist}
            />
          )}
          {isLoggedIn ? (
            <Link to="/profile/user" className="nav-userItems nav-account">
              <LuUser />
            </Link>
          ) : (
            <Link to="/auth" className="nav-userItems nav-account">
              <LuUser />
            </Link>
          )}
          <HiShoppingBag className="nav-userItems nav-shopping" />
        </div>
        <div className="nav-user-mob">
          {isLoggedIn ? (
            <a href="/profile/user" className="nav-user-account-mob">
              <LuUser />
            </a>
          ) : (
            <a href="/auth" className="nav-user-account-mob">
              <LuUser />
            </a>
          )}
          <HiShoppingBag className=" nav-shopping-mob" />
        </div>
      </div>
      <div className={`nav-sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="nav-mob-up">
          <div className="nav-mob-icon">
            <IoClose className="close-btn" onClick={closeMenu} />
            {isLoggedIn ? (
              <a href="/wishlist">
                <FaRegHeart className="mob-wishlist" />
              </a>
            ) : (
              <FaRegHeart className="mob-wishlist" onClick={handleWishlist} />
            )}
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
            {isLoggedIn ? (
              <a href="/wishlist">My Wishlist</a>
            ) : (
              <span onClick={handleWishlist}>My Wishlist</span>
            )}
          </li>
        </div>
      </div>
      <Toaster />
    </nav>
  );
};

export default Navbar;
