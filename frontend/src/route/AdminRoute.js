import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

const AdminRoute = () => {
  const [ok, setOK] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
          console.log("Token not found");
          setOK(false);
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
          setOK(true);
        } else {
          setOK(false);
        }
      } catch (error) {
        console.error("Error checking admin authentication:", error);
        setOK(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return ok ? <Outlet /> : <Navigate to="/admin" />;
};

export default AdminRoute;
