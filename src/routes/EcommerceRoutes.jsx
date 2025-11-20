// src/routes/EcommerceRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";

export default function EcommerceRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />

      <Route path="home" element={<Home />} />

      {/* fallback dentro de /dashboard */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}