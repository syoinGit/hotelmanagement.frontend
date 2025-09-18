// src/components/Modal/EditReservationModal/EditReservationModal.jsx
import React, { useState, useEffect } from 'react';
import './EditReservationModal.css';
import API_BASE from "../../../utils/apiBase.js";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isUuid = (v) => UUID_RE.test(String(v || '').trim());

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
        // 失敗しても致命傷ではない（すでに bookingId が入っていればOK）
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
        bookingId: reservation.bookingId ?? reservation.booking ?? '', // ← 万一 name が入ってきても保持
        checkInDate: formatDate(reservation.checkInDate),
        checkOutDate: formatDate(reservation.checkOutDate),
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // name や表示文字列が入ってきた場合に UUID に変換
  const ensureBookingUuid = (raw) => {
    if (isUuid(raw)) return raw;
    if (!raw) return '';
    // 名前一致で検索（完全一致）: 必要なら trim や大文字小文字無視等に拡張可
    const hit = bookings.find(b => b?.id && (b?.name === raw));
    return hit?.id || raw; // 見つからなければそのまま返す（サーバで再度バリデーション）
  };

  const handleSubmit = async () => {
    // 送信前変換
    const normalizedBookingId = ensureBookingUuid(formData.bookingId);

    // id が空 or UUID でないなら新規想定で id は送らない
    const payloadBase = {
      ...formData,
      bookingId: normalizedBookingId,
      stayDays: formData.stayDays === '' ? null : Number(formData.stayDays),
      // totalPrice が BigDecimal の場合は string で送りたいなら下の行を String() に変更
      totalPrice: formData.totalPrice === '' ? null : Number(formData.totalPrice),
    };

    // サーバ実装に合わせて：更新は PUT /reservation/update、新規は POST /reservation/register など
    const isUpdate = isUuid(formData.id);

    // 送信 payload を最終調整
    const payload = { ...payloadBase };
    if (!isUpdate) {
      delete payload.id; // 新規時は id を送らない（サーバで UUID 採番）
    }

    try {
      const url = isUpdate
        ? `${API_BASE}/reservation/update`
        : `${API_BASE}/reservation/register`;
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const resultText = await response.text();
      if (!response.ok) {
        console.error("⚠️ サーバーレスポンス:", resultText);
        alert("更新/登録に失敗しました：" + resultText);
        return;
      }

      alert(resultText || (isUpdate ? '更新しました' : '登録しました'));
      onUpdate && onUpdate();
      onClose();
    } catch (err) {
      console.error('❌ ネットワークエラー:', err);
      alert('通信エラーが発生しました');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{isUuid(formData.id) ? '予約情報を編集' : '予約を新規登録'}</h3>
        <form>
          {/* プラン選択：value には必ず UUID を入れる */}
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