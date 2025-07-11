import React, { useState, useEffect } from 'react';
import './EditReservationModal.css';

const EditReservationModal = ({ reservation, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    checkInDate: '',
    stayDays: '',
    totalPrice: '',
    status: '',
    memo: ''
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        id: reservation.id || '',
        checkInDate: reservation.checkInDate || '',
        stayDays: reservation.stayDays || '',
        totalPrice: reservation.totalPrice || '',
        status: reservation.status || '',
        memo: reservation.memo || ''
      });
    }
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3 className="modal-title">予約情報を編集</h3>
        <div className="modal-form">
          <label>チェックイン日
            <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} />
          </label>
          <label>宿泊日数
            <input type="number" name="stayDays" value={formData.stayDays} onChange={handleChange} />
          </label>
          <label>合計金額
            <input type="number" name="totalPrice" value={formData.totalPrice} onChange={handleChange} />
          </label>
          <label>ステータス
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="TEMPORARY">仮予約</option>
              <option value="NOT_CHECKED_IN">未チェックイン</option>
              <option value="CHECKED_IN">宿泊中</option>
              <option value="CHECKED_OUT">チェックアウト済み</option>
              <option value="CANCELLED">キャンセル</option>
            </select>
          </label>
          <label>メモ
            <textarea name="memo" value={formData.memo} onChange={handleChange} />
          </label>
        </div>
        <div className="modal-actions">
          <button className="btn-save" onClick={handleSubmit}>保存</button>
          <button className="btn-cancel" onClick={onClose}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};

export default EditReservationModal;
