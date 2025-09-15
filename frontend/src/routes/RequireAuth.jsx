// src/routes/RequireAuth.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE from "../utils/apiBase.js";

export default function RequireAuth({ children, pingPath = "/guests/stay" }) {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      try {
        await axios.get(`${API_BASE}${pingPath}`, { withCredentials: true });
        setChecking(false); // 認証OK
      } catch (e) {
        // 401など → ログインへ
        navigate("/login", { replace: true, state: { from: location } });
      }
    };
    check();
    // location.pathname が変わるたびに再チェックしたい場合は依存に含める
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) return null; // ここでスピナー等を返してもOK
  return children;
}