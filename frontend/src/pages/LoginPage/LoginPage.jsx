import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (loginId, loginPassword) => {
    const params = new URLSearchParams();
    params.append("id", loginId);
    params.append("password", loginPassword);
    try {
      await axios.post("http://localhost:8080/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      });
      navigate("/home");
    } catch (err) {
      setError("ログインに失敗しました。");
      console.error("ログインエラー:", err);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">ログイン</h2>

      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="ID"
        className="login-input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
        className="login-input"
      />

      <div className="login-actions">
        <button
          onClick={() => handleLogin(id, password)}
          disabled={!id || !password}
          className="btn primary"
        >
          ログイン
        </button>
        <button
          onClick={() => handleLogin("testuser01", "testpass123")}
          className="btn ghost"
        >
          ゲストログイン
        </button>
      </div>

      <p className="register-hint">
        アカウントをお持ちでない方は <Link to="/register-user">新規登録</Link>
      </p>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default LoginPage;