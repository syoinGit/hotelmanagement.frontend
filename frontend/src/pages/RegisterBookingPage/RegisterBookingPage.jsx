// src/pages/RegisterBookingPage/RegisterBookingPage.jsx
import React, { useState } from "react";
import axios from "axios";
import "./RegisterBookingPage.css";
import API_BASE from "../../utils/apiBase.js";

export default function RegisterBookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isAvailable: true, // UIは出さないが常にtrueで送る
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // 簡易バリデーション
      if (!formData.name.trim()) throw new Error("プラン名は必須です。");
      if (formData.price === "" || isNaN(Number(formData.price))) {
        throw new Error("金額は数値で入力してください。");
      }

      // Booking DTO に準拠した payload（id, userId は送らない）
      const payload = {
        name: formData.name.trim(),
        description: (formData.description || "").trim(),
        price: Number(formData.price),        // ← BigDecimal に自然マッピング
        isAvailable: Boolean(formData.isAvailable),
      };

      const res = await axios.put(`${API_BASE}/booking/register`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        validateStatus: (s) => s >= 200 && s < 300,
      });

      const msg =
        typeof res.data === "string"
          ? res.data
          : res.data?.message || "宿泊プランの登録が完了しました。";

      setMessage(`✅ ${msg}`);
      setFormData({ name: "", description: "", price: "", isAvailable: true });
    } catch (err) {
      // サーバのバリデーションメッセージを優先表示
      const data = err?.response?.data;
      const serverMsg =
        (typeof data === "string" && data) ||
        data?.message ||
        Object.values(data?.errors || {})?.join(" / ");
      setMessage(`❌ ${serverMsg || err.message || "登録に失敗しました。"}`);
      console.error("登録エラー:", err);
    }
  };

  return (
    <div className="rbp">
      <header className="rbp-header">
        <h1 className="rbp-title">宿泊プラン登録</h1>
      </header>

      <form className="rbp-card rbp-form" onSubmit={handleSubmit}>
        <label>
          プラン名（必須）
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          説明
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <label>
          金額（必須）
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            inputMode="decimal"
          />
        </label>

        <div className="rbp-actions">
          <button type="submit" className="btn primary">登録</button>
        </div>
      </form>

      {message && <p className="rbp-message">{message}</p>}
    </div>
  );
}