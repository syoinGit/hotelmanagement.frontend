import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (loginId, loginPassword) => {
    const params = new URLSearchParams();
    params.append("id", loginId);  // Spring Securityに合わせる
    params.append("password", loginPassword);

    try {
      await axios.post("http://localhost:8080/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true, // セッションクッキー送信
      });
      navigate("/home");
    } catch (err) {
      setError("ログインに失敗しました。");
      console.error("ログインエラー:", err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>ログイン</h2>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="ID"
        style={{ display: "block", width: "100%", marginBottom: "1rem" }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
        style={{ display: "block", width: "100%", marginBottom: "1rem" }}
      />
      <button
        onClick={() => handleLogin(id, password)}
        disabled={!id || !password}
        style={{ marginRight: "1rem" }}
      >
        ログイン
      </button>
      <button onClick={() => handleLogin("testuser01", "testpass123")}>
        ゲストログイン
      </button>
      <p style={{ marginTop: "1rem" }}>
        アカウントをお持ちでない方は <Link to="/register">新規登録</Link>
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;