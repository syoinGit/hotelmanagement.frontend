import React, { useState } from 'react';
import axios from 'axios';
import './RegisterBookingPage.css';

const RegisterBookingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true
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
        price: formData.price.toString(), // BigDecimal対応のため文字列で送信
      };

      console.log("送信内容:", payload); // デバッグ用ログ

      await axios.put('http://localhost:8080/registerBooking', payload); // Spring Bootのポートに合わせて

      setMessage('✅ 宿泊プランの登録が完了しました！');
      setFormData({
        name: '',
        description: '',
        price: '',
        isAvailable: true
      });
    } catch (error) {
      console.error("登録エラー:", error);
      setMessage('❌ 登録に失敗しました。入力内容を確認してください。');
    }
  };

  return (
    <div className="booking-form-container">
      <h2>宿泊プラン登録</h2>
      <form className="booking-form" onSubmit={handleSubmit}>
        <label>
          プラン名（必須）:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          説明:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          金額（必須）:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />
          利用可能にする
        </label>
        <button type="submit">登録</button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default RegisterBookingPage;