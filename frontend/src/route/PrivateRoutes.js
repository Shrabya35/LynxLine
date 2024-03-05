import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoutes = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAuthenticated =
    !!localStorage.getItem("token") || !!sessionStorage.getItem("token");

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
          console.log("Token not found");
          setLoading(false);
          return;
        }

        const res = await axios.get("/api/v1/auth/admin-auth", {
          headers: {
            Authorization: token,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (res.data && res.data.ok) {
          console.log("User is an admin");
          setIsAdmin(true);
        } else {
          console.log("User is not an admin");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin authentication:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  if (isAdmin) {
    return <Navigate to="/profile/admin" />;
  }
  if (isAuthenticated && !isAdmin) {
    return <Outlet />;
  }

  return null;
};

export default PrivateRoutes;
