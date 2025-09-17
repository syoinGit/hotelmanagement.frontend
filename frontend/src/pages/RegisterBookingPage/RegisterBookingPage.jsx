import React, { useState } from 'react';
import axios from 'axios';
import './RegisterBookingPage.css';
import API_BASE from "../../utils/apiBase.js";

export default function RegisterBookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true, // ← UIは出さないけど常にtrue送信
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: formData.price.toString(), // BigDecimal対策
      };

      await axios.put(`${API_BASE}/registerBooking`, payload);
      setMessage('✅ 宿泊プランの登録が完了しました！');
      setFormData({
        name: '',
        description: '',
        price: '',
        isAvailable: true,
      });
    } catch (error) {
      console.error('登録エラー:', error);
      setMessage('❌ 登録に失敗しました。入力内容を確認してください。');
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