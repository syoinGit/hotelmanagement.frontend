import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EditGuestModal.css'; // スタイルは必要に応じて

const EditGuestModal = ({ guestDetail, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    kanaName: '',
    gender: '',
    age: '',
    region: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    console.log("guestDetail:", guestDetail);
    if (guestDetail && guestDetail.guest) {
      const g = guestDetail.guest;
      setFormData({
        id: g.id || '',
        name: g.name || '',
        kanaName: g.kanaName || '',
        gender: g.gender || '',
        age: g.age || '',
        region: g.region || '',
        email: g.email || '',
        phone: g.phone || ''
      });
    }
  }, [guestDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put('http://localhost:8080/guest/update', formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert("更新しました");
      onClose();
    } catch (error) {
      console.error('❌ 更新エラー:', error);
      alert("更新に失敗しました");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>ゲスト情報を編集</h3>

        <label>名前</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>カナ</label>
        <input type="text" name="kanaName" value={formData.kanaName} onChange={handleChange} />

        <label>性別</label>
        <input type="text" name="gender" value={formData.gender} onChange={handleChange} />

        <label>年齢</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} />

        <label>地域</label>
        <input type="text" name="region" value={formData.region} onChange={handleChange} />

        <label>メール</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />

        <label>電話番号</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />

        <div className="modal-buttons">
          <button onClick={handleSubmit}>保存</button>
          <button onClick={onClose}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};

export default EditGuestModal;