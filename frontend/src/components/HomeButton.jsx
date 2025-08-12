import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const HomeButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // トップページでは表示しない
  if (location.pathname === "/" || location.pathname === "/top") {
    return null;
  }

  return (
    <button
      onClick={() => navigate("/home")}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#4f46e5",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: "50%",
        border: "none",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        cursor: "pointer",
      }}
    >
      <Home size={24} />
    </button>
  );
};

export default HomeButton;