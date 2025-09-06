// src/components/Modal/EditGuestModal/EditGuestModal.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import API_BASE from '../../../utils/apiBase';
import './EditGuestModal.css';

axios.defaults.withCredentials = true;

const EditGuestModal = ({ guestDetail, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    kanaName: '',
    gender: '',
    age: '',
    region: '',
    email: '',
    phone: '',
    deleted: false,
  });

  // ゲスト本体を安全に取り出し
  const guest = useMemo(() => guestDetail?.guest ?? null, [guestDetail]);

  useEffect(() => {
    if (!guest) return;
    setFormData({
      id: guest.id ?? '',
      name: guest.name ?? '',
      kanaName: guest.kanaName ?? '',
      gender: guest.gender ?? '',
      age: guest.age ?? '',
      region: guest.region ?? '',
      email: guest.email ?? '',
      phone: guest.phone ?? '',
      deleted: !!guest.deleted,
    });
  }, [guest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ① ゲスト情報の更新（PUT /guest/update）
  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE}/guest/update`, {
        id: formData.id,
        name: formData.name,
        kanaName: formData.kanaName,
        gender: formData.gender,
        age: Number(formData.age) || 0,
        region: formData.region,
        email: formData.email,
        phone: formData.phone,
      });
      alert('更新しました');
      onClose?.();
    } catch (error) {
      console.error('❌ 更新エラー:', error);
      alert('更新に失敗しました');
    }
  };

  // ② 論理削除のトグル（PUT /guest/deleted?id=&name=）
  // サーバ側で削除フラグをトグルします（true<->false）。
  const handleLogicalDelete = async () => {
    try {
      const res = await axios.put(`${API_BASE}/guest/deleted`, null, {
        params: {
          id: formData.id,
          name: formData.name,
        },
      });
      alert(res?.data ?? '更新しました');
      onClose?.();
    } catch (error) {
      console.error('❌ 論理削除エラー:', error);
      alert('削除/復元に失敗しました');
    }
  };

  if (!guestDetail) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3 className="modal-title">ゲスト情報を編集</h3>

        <div className="form-grid">
          <label className="form-label">名前</label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label className="form-label">カナ</label>
          <input
            className="form-input"
            type="text"
            name="kanaName"
            value={formData.kanaName}
            onChange={handleChange}
          />

          <label className="form-label">性別</label>
          <input
            className="form-input"
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />

          <label className="form-label">年齢</label>
          <input
            className="form-input"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />

          <label className="form-label">地域</label>
          <input
            className="form-input"
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
          />

          <label className="form-label">メール</label>
          <input
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label className="form-label">電話番号</label>
          <input
            className="form-input"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="modal-buttons">
          <button className="btn primary" onClick={handleSave}>
            保存
          </button>

          {/* 現在の削除状態に応じてラベルだけ変更（処理は同じトグル） */}
          <button
            className={formData.deleted ? 'btn ghost' : 'btn danger'}
            onClick={handleLogicalDelete}
            title={formData.deleted ? '削除を戻す' : '削除する'}
          >
            {formData.deleted ? '削除を戻す' : '削除する'}
          </button>

          <button className="btn" onClick={onClose}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGuestModal;