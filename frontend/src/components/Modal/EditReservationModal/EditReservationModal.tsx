import React, { useState, useEffect } from 'react';
import './EditReservationModal.css';
import API_BASE from "../../../utils/apiBase.js";
import Reservation from "../../../models/Reservation.js"

type Props = {
reservation?: Reservation;
onClose: () => void;
onUpdate: () => void;
}

const EditReservationModal: React.FC<Props> = ({ reservation, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<Reservation>(reservation || new Reservation());

  });

  // 画面用：プラン選択候補（name と id のマッピング用）
  const [bookings, setBookings] = useState([]);

  // 日付文字列を YYYY-MM-DD に整形
  const formatDate = (dateString) => (dateString ? dateString.slice(0, 10) : '');

  useEffect(() => {
    // プラン一覧を取得して name <-> id の突き合わせを可能にする
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/bookings`, { credentials: 'include' });
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn('Failed to load bookings', e);
        setBookings([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (reservation) {
      setFormData({
        id: reservation.id ?? '',
        guestId: reservation.guestId ?? '',
        bookingId: reservation.bookingId ?? reservation.booking ?? '',
        checkInDate: formatDate(reservation.checkInDate),
        stayDays: reservation.stayDays ?? '',
        totalPrice: reservation.totalPrice ?? '',
        status: reservation.status || 'NOT_CHECKED_IN',
        memo: reservation.memo || '',
        createdAt: reservation.createdAt ?? '',
        userId: reservation.userId ?? ''
      });
    }
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  // name や表示文字列が入ってきた場合に UUID に変換
  const ensureBookingUuid = (raw) => {
    if (isUuid(raw)) return raw;
    if (!raw) return '';
    const hit = bookings.find(b => b?.id && (b?.name === raw));
    return hit?.id || raw;
  };

  const handleSubmit = async () => {
    const normalizedBookingId = ensureBookingUuid(formData.bookingId);

    const payload = {
      ...formData,
      bookingId: normalizedBookingId,
      stayDays: formData.stayDays === '' ? null : Number(formData.stayDays),
      totalPrice: formData.totalPrice === '' ? null : Number(formData.totalPrice),
    };

    try {
      const url = `${API_BASE}/reservation/update`;
      const method = 'PUT';

      console.log("送信payload:", payload);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const resultText = await response.text();
      if (!response.ok) {
        console.error("⚠️ サーバーレスポンス:", resultText);
        alert("更新に失敗しました：" + resultText);
        return;
      }

      alert(resultText || '更新しました');
      onUpdate?.();
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
        <div className="modal-form">
          <label>
            宿泊プラン：
            <select
              name="bookingId"
              value={isUuid(formData.bookingId) ? formData.bookingId : ensureBookingUuid(formData.bookingId)}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              {bookings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name ?? b.id}
                </option>
              ))}
            </select>
          </label>

          <label>
            チェックイン日：
            <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} />
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
        </div>
        <div className="modal-buttons">
          <button type="button" onClick={handleSubmit}>保存</button>
          <button type="button" onClick={onClose}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};

export default EditReservationModal;