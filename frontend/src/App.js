import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import Men from "./Pages/Home/Men";
import Women from "./Pages/Home/Women";
import Accesories from "./Pages/Home/Accesories";
import About from "./Pages/About/About";
import Auth from "./Pages/Auth/Auth";
import PageNotFound from "./Pages/PNF/PageNotFound";
import ResetPassword from "./Pages/Auth/ResetPassword";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import PrivateRoutes from "./route/PrivateRoutes";
import AdminRoute from "./route/AdminRoute";
import AdminProfile from "./Pages/Profile/AdminProfile/Admin";
import UserProfile from "./Pages/Profile/UserProfile/User";
import CreateCategory from "./Pages/Profile/AdminProfile/CreateCategory";
import AddProduct from "./Pages/Profile/AdminProfile/AddProduct";
import SingleProduct from "./Pages/SingleProduct/SingleProduct";
import Wishlist from "./Pages/Wishlist/Wishlist";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/accessories" element={<Accesories />} />
        <Route path="/products/:slug" element={<SingleProduct />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/" element={<PrivateRoutes />}>
          <Route path="user" element={<UserProfile />} />
        </Route>
        <Route path="/profile/" element={<AdminRoute />}>
          <Route path="admin" element={<AdminProfile />} />
          <Route path="admin/category" element={<CreateCategory />} />
          <Route path="admin/product" element={<AddProduct />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
