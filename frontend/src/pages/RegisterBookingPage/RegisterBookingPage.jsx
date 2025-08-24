import React, { useState } from 'react';
import axios from 'axios';
import './RegisterBookingPage.css';

const RegisterBookingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true, // ← UIは消したが値はtrueで送る
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
        // BigDecimal対応：stringで送信
        price: formData.price.toString(),
      };

      await axios.put('http://localhost:8080/registerBooking', payload);
      setMessage('✅ 宿泊プランの登録が完了しました！');
      setFormData({
        name: '',
        description: '',
        price: '',
        isAvailable: true, // 送信後も既定はtrueのまま
      });
    } catch (error) {
      console.error('登録エラー:', error);
      setMessage('❌ 登録に失敗しました。入力内容を確認してください。');
    }
  };

  return (
    <div className="register-booking-page">
      <h1 className="page-title">宿泊プラン登録</h1>

      <form className="booking-form" onSubmit={handleSubmit}>
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
        
        <div className="form-actions">
          <button type="submit" className="primary">登録</button>
        </div>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default RegisterBookingPage;