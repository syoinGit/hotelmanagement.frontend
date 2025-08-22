import React, { useState } from "react";
import axios from "axios";

function RegisterUserPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // サーバーのエンドポイントに合わせてURLを設定してください
      const response = await axios.put("http://localhost:8080/user/register", {
        id,
        password,
      });
      setMessage(response.data)
    } catch (error) {
      console.error(error);
      setMessage("ユーザー登録に失敗しました");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>ユーザー登録</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ユーザーID：</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>パスワード：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">登録</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterUserPage;