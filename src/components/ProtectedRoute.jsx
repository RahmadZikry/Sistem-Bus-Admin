// File: src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    return true;
  } else {
    return false;
  }
};

const ProtectedRoute = () => {
  const isAuth = useAuth();

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
