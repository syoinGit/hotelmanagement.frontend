import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './CheckInPage.css';
import API_BASE from "../../utils/apiBase.js";

const formatDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const formatJPY = (n) =>
  typeof n === 'number'
    ? n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })
    : '';

const CheckInPage = () => {
  const [guests, setGuests] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // 確認ダイアログ
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(null); // { reservationId, guestName }

  useEffect(() => {
    const fetchTodayGuests = async () => {
      try {
        const res = await axios.get(`${API_BASE}/guests/check-in-today`, {
          withCredentials: true,
        });
        setGuests(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('本日宿泊者の取得失敗:', error);
        setMessage('本日チェックイン予定の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchTodayGuests();
  }, []);

  const openConfirm = (reservationId, guestName) => {
    setPending({ reservationId, guestName });
    setConfirmOpen(true);
  };
  const closeConfirm = useCallback(() => {
    setConfirmOpen(false);
    setPending(null);
  }, []);

  const doCheckIn = async () => {
    if (!pending) return;
    const { reservationId, guestName } = pending;
    try {
      const res = await axios.put(
        `${API_BASE}/guest/checkIn`,
        {},
        { params: { id: reservationId, name: guestName }, withCredentials: true }
      );
      setMessage(typeof res.data === 'string' ? res.data : 'チェックイン完了');

      // 対象予約を除去（一覧を即時更新）
      setGuests((prev) =>
        prev
          .map((g) => ({
            ...g,
            reservations: (g.reservations || []).filter((r) => r.id !== reservationId),
          }))
          .filter((g) => (g.reservations || []).length > 0)
      );
    } catch (error) {
      console.error('チェックイン失敗:', error);
      const msg =
        error?.response?.data?.message ||
        (typeof error?.response?.data === 'string' ? error.response.data : null) ||
        'チェックインに失敗しました。';
      setMessage(msg);
    } finally {
      closeConfirm();
    }
  };

  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e) => e.key === 'Escape' && closeConfirm();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmOpen, closeConfirm]);

  return (
    <div className="check-in-container">
      <div className="ci-header">
        {message && <p className="message">{message}</p>}
      </div>

    {/* 一覧：カード表示 */}
{loading ? (
  <p className="ci-muted">読み込み中…</p>
) : guests.length === 0 ? (
  <p className="ci-muted">本日チェックイン予定はありません。</p>
) : (
  <div className="ci-card-grid">
    {guests.flatMap((g) =>
      (g.reservations || []).map((res) => {
        const booking =
          (g.bookings || []).find((b) => b.id === res.bookingId) || null;

        return (
          <article className="ci-card" key={res.id}>
            <header className="ci-card-header">
              <div className="ci-avatar">{(g.guest?.name ?? '？').slice(0, 1)}</div>
              <div>
                <div className="ci-name">{g.guest?.name ?? ''}</div>
                <div className="ci-sub ci-mono">{g.guest?.phone ?? ''}</div>
              </div>
            </header>

            <div className="ci-card-body">
              <div className="ci-row">
                <span className="ci-label">プラン</span>
                <span className="ci-value">{booking ? booking.name : '不明なプラン'}</span>
              </div>
              <div className="ci-row">
                <span className="ci-label">泊数</span>
                <span className="ci-value">{res.stayDays} 泊</span>
              </div>
              <div className="ci-row ci-dates">
                <div className="ci-chip ci-chip-in">
                  IN：{formatDate(res.checkInDate)}
                </div>
                <div className="ci-chip ci-chip-out">
                  OUT：{formatDate(res.checkOutDate)}
                </div>
              </div>
              <div className="ci-total">
                総額 <strong className="ci-amount">{formatJPY(res.totalPrice)}</strong>
              </div>
            </div>

            <footer className="ci-card-footer">
              <button
                className="ci-btn-primary"
                onClick={() => openConfirm(res.id, g.guest?.name ?? '')}
              >
                チェックイン
              </button>
            </footer>
          </article>
        );
      })
    )}
  </div>
)}

      {confirmOpen && (
        <div className="ci-modal-backdrop" onClick={closeConfirm}>
          <div
            className="ci-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="ci-modal-title">チェックインの確認</h3>
            <p className="ci-modal-body">
              {pending?.guestName ? `${pending.guestName} 様を` : 'この宿泊者を'}
              チェックインします。よろしいですか？
            </p>
            <div className="ci-modal-actions">
              <button className="ci-btn-secondary" onClick={closeConfirm}>
                いいえ
              </button>
              <button className="ci-btn-primary" onClick={doCheckIn}>
                はい
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInPage;