import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Pages
import HomePage from "./Pages/Home/HomePage";
import Men from "./Pages/Home/Men";
import Women from "./Pages/Home/Women";
import Accesories from "./Pages/Home/Accesories";
import SingleProduct from "./Pages/SingleProduct/SingleProduct";
import Wishlist from "./Pages/Wishlist/Wishlist";
import SearchPage from "./Pages/ProductsPage/SearchPage";
import ViewMore from "./Pages/ProductsPage/ViewMore";

//User Auth
import Auth from "./Pages/Auth/Auth";
import PageNotFound from "./Pages/PNF/PageNotFound";
import ResetPassword from "./Pages/Auth/ResetPassword";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import PrivateRoutes from "./route/PrivateRoutes";
import UserProfile from "./Pages/Profile/UserProfile/User";

//Admin
import AdminRoute from "./route/AdminRoute";
import AdminProfile from "./Pages/Profile/AdminProfile/Admin";
import CreateCategory from "./Pages/Profile/AdminProfile/CreateCategory";
import ViewProduct from "./Pages/Profile/AdminProfile/ViewProduct";
import AddProduct from "./Pages/Profile/AdminProfile/AddProduct";
import ModifyProduct from "./Pages/Profile/AdminProfile/ModifyProduct";

//Others
import About from "./Pages/About/About";

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
        <Route path="/search-page/" element={<SearchPage />} />
        <Route path="/view-more" element={<ViewMore />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/" element={<PrivateRoutes />}>
          <Route path="user" element={<UserProfile />} />
        </Route>
        <Route path="/profile/" element={<AdminRoute />}>
          <Route path="admin" element={<AdminProfile />} />
          <Route path="admin/category" element={<CreateCategory />} />
          <Route path="admin/add-product" element={<AddProduct />} />
          <Route path="admin/view-products" element={<ViewProduct />} />
          <Route path="admin/product/:slug" element={<ModifyProduct />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
