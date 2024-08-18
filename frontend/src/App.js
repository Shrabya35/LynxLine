import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Routes
import PrivateRoutes from "./route/PrivateRoutes";
import AdminRoute from "./route/AdminRoute";
import CheckoutRoute from "./route/CheckoutRoute";

//Pages
import HomePage from "./Pages/Home/HomePage";
import Men from "./Pages/Home/Men";
import Women from "./Pages/Home/Women";
import Accesories from "./Pages/Home/Accesories";
import SingleProduct from "./Pages/SingleProduct/SingleProduct";
import Wishlist from "./Pages/Wishlist/Wishlist";
import ShoppingBag from "./Pages/ShoppingBag/ShoppingBag";
import SearchPage from "./Pages/ProductsPage/SearchPage";
import ViewMore from "./Pages/ProductsPage/ViewMore";

//User Auth
import Auth from "./Pages/Auth/Auth";
import ResetPassword from "./Pages/Auth/ResetPassword";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import UserProfile from "./Pages/Profile/UserProfile/User";

//Admin
import AdminDashboard from "./Pages/Profile/AdminProfile/AdminDashboard";
import CreateCategory from "./Pages/Profile/AdminProfile/CreateCategory";
import ViewProduct from "./Pages/Profile/AdminProfile/ViewProduct";
import AddProduct from "./Pages/Profile/AdminProfile/AddProduct";
import ModifyProduct from "./Pages/Profile/AdminProfile/ModifyProduct";
import AdminAllOrder from "./Pages/Profile/AdminProfile/AdminAllOrder";
import AdminPendingOrder from "./Pages/Profile/AdminProfile/AdminPendingOrder";
import AdminProcessingOrder from "./Pages/Profile/AdminProfile/AdminProcessingOrder";
import AdminCancelledOrder from "./Pages/Profile/AdminProfile/AdminCancelledOrder";
import AdminDeliveredOrder from "./Pages/Profile/AdminProfile/AdminDeliveredOrder";
import OrderDetails from "./Pages/Profile/AdminProfile/OrderDetails";

//Static
import About from "./Pages/StaticPages/About";
import TermsAndCondition from "./Pages/StaticPages/TermsAndCondition";
import PrivacyPolicy from "./Pages/StaticPages/PrivacyPolicy";
import ReturnPolicy from "./Pages/StaticPages/ReturnPolicy";
import ContactUs from "./Pages/StaticPages/ContactUs";
import OrderGuide from "./Pages/StaticPages/OrderGuide";

//Page Not Found
import PageNotFound from "./Pages/PNF/PageNotFound";

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
        <Route path="/shopping-bag" element={<ShoppingBag />} />
        <Route path="/checkout" element={<CheckoutRoute />} />
        <Route path="/profile/" element={<PrivateRoutes />}>
          <Route path="user" element={<UserProfile />} />
        </Route>
        <Route path="/profile/" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/category" element={<CreateCategory />} />
          <Route path="admin/add-product" element={<AddProduct />} />
          <Route path="admin/view-products" element={<ViewProduct />} />
          <Route path="admin/product/:slug" element={<ModifyProduct />} />
          <Route path="admin/all-orders" element={<AdminAllOrder />} />
          <Route path="admin/pending-orders" element={<AdminPendingOrder />} />
          <Route
            path="admin/processing-orders"
            element={<AdminProcessingOrder />}
          />
          <Route
            path="admin/delivered-orders"
            element={<AdminDeliveredOrder />}
          />
          <Route
            path="admin/cancelled-orders"
            element={<AdminCancelledOrder />}
          />
          <Route path="admin/view-order/" element={<OrderDetails />} />
        </Route>
        <Route path="/article/about" element={<About />} />
        <Route
          path="/article/terms-and-condition"
          element={<TermsAndCondition />}
        />
        <Route path="/article/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/article/return-policy" element={<ReturnPolicy />} />
        <Route path="/article/contact-us" element={<ContactUs />} />
        <Route path="/article/order-guide" element={<OrderGuide />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
