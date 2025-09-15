import React, { useState } from "react";
import axios from "axios";
import "./RegisterUserPage.css";
import API_BASE from "../../utils/apiBase.js";

function RegisterUserPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" | "error"
  const [loading, setLoading] = useState(false);

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
      // サーバからの ResponseEntity<String> の本文をそのまま表示
      setMessage({ text: res?.data ?? "登録しました。", type: "success" });
      setId("");
      setPassword("");
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
      </div>
    </div>
  );
}

export default RegisterUserPage;