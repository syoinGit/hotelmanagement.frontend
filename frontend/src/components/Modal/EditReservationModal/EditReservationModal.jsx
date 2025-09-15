import React, { useState, useEffect } from 'react';
import './EditReservationModal.css';
import API_BASE from "../../../utils/apiBase.js";

const EditReservationModal = ({ reservation, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    id: '',
    guestId: '',
    bookingId: '',
    checkInDate: '',
    checkOutDate: '',
    stayDays: '',
    totalPrice: '',
    status: 'NOT_CHECKED_IN',
    memo: '',
    createdAt: '',
    userId: ''
  });

  // 日付文字列を YYYY-MM-DD に整形
  const formatDate = (dateString) => {
    return dateString ? dateString.slice(0, 10) : '';
  };

  useEffect(() => {
    if (reservation) {
      setFormData({
        id: reservation.id,
        guestId: reservation.guestId,
        bookingId: reservation.bookingId,
        checkInDate: formatDate(reservation.checkInDate),
        checkOutDate: formatDate(reservation.checkOutDate),
        stayDays: reservation.stayDays || '',
        totalPrice: reservation.totalPrice || '',
        status: reservation.status || 'NOT_CHECKED_IN',
        memo: reservation.memo || '',
        createdAt: reservation.createdAt,
        userId: reservation.userId
      });
    }
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      stayDays: Number(formData.stayDays),
      totalPrice: Number(formData.totalPrice)
    };

    try {
  const response = await fetch(`${API_BASE}/reservation/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Cookie 送信必須
    body: JSON.stringify(payload),
  });

      const result = await response.text();

      if (!response.ok) {
        console.error("⚠️ サーバーレスポンス:", result);
        alert("更新に失敗しました：" + result);
        return;
      }

      alert(result);
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      console.error('❌ ネットワークエラー:', err);
      alert('通信エラーが発生しました');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>予約情報を編集</h3>
        <form>
          <label>
            チェックイン日：
            <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} />
          </label>
          <label>
            チェックアウト日：
            <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} />
          </label>
          <label>
            宿泊日数：
            <input type="number" name="stayDays" value={formData.stayDays} onChange={handleChange} />
          </label>
          <label>
            合計金額：
            <input type="number" name="totalPrice" value={formData.totalPrice} onChange={handleChange} />
          </label>
          <label>
            ステータス：
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="TEMPORARY">仮予約</option>
              <option value="NOT_CHECKED_IN">未チェックイン</option>
              <option value="CHECKED_IN">宿泊中</option>
              <option value="CHECKED_OUT">チェックアウト済み</option>
              <option value="CANCELLED">キャンセル</option>
            </select>
          </label>
          <label>
            メモ：
            <textarea name="memo" value={formData.memo} onChange={handleChange} />
          </label>
        </form>
        <div className="modal-buttons">
          <button onClick={handleSubmit}>保存</button>
          <button onClick={onClose}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};

export default EditReservationModal;