// src/pages/RegisterUserPage/RegisterUserPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ← 追加
import "./RegisterUserPage.css";
import API_BASE from "../../utils/apiBase.js";

function RegisterUserPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" | "error"
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ← 追加

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !password) return;
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      const res = await axios.put(
        `${API_BASE}/user/register`,
        { id, password },
        { withCredentials: true }
      );
      setMessage({ text: res?.data ?? "登録しました。", type: "success" });
      setId("");
      setPassword("");

      // ✅ 登録後にログインページに戻る
      setTimeout(() => {
        navigate("/login");
      }, 1000); // 1秒だけ成功メッセージを見せる
    } catch (err) {
      console.error("register error:", err);
      setMessage({ text: "ユーザー登録に失敗しました", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-bg">
      <div className="register-card">
        <h2 className="register-title">ユーザー登録</h2>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <div className="form-row">
            <label className="form-label" htmlFor="userId">
              ユーザーID
            </label>
            <input
              id="userId"
              className="form-input"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="例）hotel_admin01"
              required
            />
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="password">
              パスワード
            </label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上を推奨"
              required
            />
          </div>

          <div className="submit-area">
            <button
              type="submit"
              className="btn primary"
              disabled={!id || !password || loading}
            >
              {loading ? "登録中..." : "登録"}
            </button>
          </div>
        </form>

        {message.text && (
          <p
            className={`message ${
              message.type === "success" ? "success" : "error"
            }`}
            role="alert"
          >
            {message.text}
          </p>
        )}

        {/* ✅ ログイン画面に戻るボタン */}
        <div className="back-to-login">
          <button
            className="btn ghost"
            onClick={() => navigate("/login")}
          >
            ログイン画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterUserPage;