import React, { useState, useEffect } from 'react';
import './EditGuestModal.css';

const EditGuestModal = ({ guestDetail, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    kanaName: '',
    phone: '',
    region: '',
    gender: '',
    age: '',
    email: ''
  });

  useEffect(() => {
    if (guestDetail && guestDetail.guest) {
      setFormData({ ...guestDetail.guest });
    }
  }, [guestDetail]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log('保存データ:', formData);
    // APIでPUT等する処理をここに追加予定なら記述
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3 className="modal-title">宿泊者情報を編集</h3>
        <form className="modal-form">
          <label>名前：<input name="name" value={formData.name} onChange={handleChange} /></label>
          <label>ふりがな：<input name="kanaName" value={formData.kanaName} onChange={handleChange} /></label>
          <label>電話番号：<input name="phone" value={formData.phone} onChange={handleChange} /></label>
          <label>地域：<input name="region" value={formData.region} onChange={handleChange} /></label>
          <label>性別：<input name="gender" value={formData.gender} onChange={handleChange} /></label>
          <label>年齢：<input name="age" type="number" value={formData.age} onChange={handleChange} /></label>
          <label>メール：<input name="email" value={formData.email} onChange={handleChange} /></label>
        </form>
        <div className="modal-actions">
          <button className="btn-save" onClick={handleSave}>保存</button>
          <button className="btn-cancel" onClick={onClose}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};

export default EditGuestModal;