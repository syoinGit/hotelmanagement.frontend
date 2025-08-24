import React, { useMemo, useState } from 'react';
import axios from 'axios';
import {
  FaSearch, FaUser, FaBed, FaPhone, FaCalendarAlt, FaClipboardList, FaEdit
} from 'react-icons/fa';
import './SearchGuestPage.css';
import EditGuestModal from '../../components/Modal/EditGuestModal/EditGuestModal';
import EditReservationModal from '../../components/Modal/EditReservationModal/EditReservationModal';

// すべての axios リクエストで Cookie を送る
axios.defaults.withCredentials = true;

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== 'undefined' && window.API_BASE) ||
  'http://localhost:8080';

const SearchGuestPage = () => {
  // 検索フォーム
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    kanaName: '',
    phone: '',
    checkInDate: '',
    checkOutDate: ''
  });

  // 結果・状態
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCheckedOut, setShowCheckedOut] = useState(false);

  // モーダル
  const [selectedGuestDetail, setSelectedGuestDetail] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const canSearch = useMemo(() => {
    const { id, name, kanaName, phone, checkInDate, checkOutDate } = formData;
    return !!(id || name || kanaName || phone || checkInDate || checkOutDate);
  }, [formData]);

  const handleSearch = async () => {
    if (!canSearch) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/guest/search`, formData);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('検索失敗:', err);
      setError('検索に失敗しました。入力内容をご確認ください。');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="search-page">  {/* ★ スコープ用のルートクラス */}
      <div className="search-guest-container">
        <h1 className="page-title">宿泊者検索</h1>

        {/* 検索フォーム */}
        <form className="form search-form" onSubmit={onSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="名前"
              value={formData.name}
              onChange={handleChange}
              aria-label="名前"
            />
            <input
              type="text"
              name="kanaName"
              placeholder="フリガナ"
              value={formData.kanaName}
              onChange={handleChange}
              aria-label="フリガナ"
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="phone"
              placeholder="電話番号"
              value={formData.phone}
              onChange={handleChange}
              aria-label="電話番号"
              inputMode="tel"
            />
          </div>

          <div className="form-row">
            <label htmlFor="checkInDate">チェックイン</label>
            <input
              id="checkInDate"
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              aria-label="チェックイン日"
            />
            <label htmlFor="checkOutDate">チェックアウト</label>
            <input
              id="checkOutDate"
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              aria-label="チェックアウト日"
            />
          </div>

          <div className="form-row form-actions">
            <button
              type="submit"
              className="search-button"
              disabled={!canSearch || loading}
            >
              <FaSearch style={{ marginRight: 6 }} />
              {loading ? '検索中…' : '検索する'}
            </button>

            <button
              type="button"
              className="toggle-button"
              onClick={() => setShowCheckedOut(v => !v)}
            >
              {showCheckedOut ? 'チェックアウト済みを非表示' : 'チェックアウト済みも表示'}
            </button>
          </div>
        </form>

        {/* メッセージ */}
        {error && <p className="error">{error}</p>}

        {/* 結果 */}
        <div className="results-container">
          <div className="card-grid">
            {results.map((guestDetail, index) => {
              const { guest, reservations = [], bookings = [] } = guestDetail || {};
              // チェックアウト済フラグでフィルタ
              const visibleReservations = reservations.filter(
                r => showCheckedOut || r.status !== 'CHECKED_OUT'
              );
              if (!guest || visibleReservations.length === 0) return null;

              const guestKey = guest.id || `guest-${index}`;

              return (
                <div key={guestKey} className="reservation-card">
                  {/* 宿泊者情報 */}
                  <div className="guest-info" style={{ marginBottom: 10 }}>
                    <h3><FaUser /> 宿泊者情報</h3>
                    <p><strong>名前:</strong> {guest.name}</p>
                    <p><strong>フリガナ:</strong> {guest.kanaName}</p>
                    <p><strong><FaPhone /> 電話番号:</strong> {guest.phone}</p>
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => {
                        setSelectedGuestDetail(guestDetail);
                        setGuestModalOpen(true);
                      }}
                    >
                      <FaEdit /> ゲスト情報を編集
                    </button>
                  </div>

                  {/* 宿泊情報（予約ごと） */}
                  <details className="reservation-info" style={{ borderTop: '1px solid #ddd', paddingTop: 10 }}>
                    <summary>
                      <strong><FaBed /> 宿泊情報（{visibleReservations.length}件）</strong>
                    </summary>

                    {visibleReservations.map((reservation) => {
                      const booking =
                        bookings.find(b => b.id === reservation.bookingId) || null;

                      const rowKey = reservation.id || `${guestKey}-resv-${reservation.bookingId}-${reservation.checkInDate}`;

                      return (
                        <div key={rowKey} className="reservation-row" style={{ padding: '8px 0', borderBottom: '1px dashed #e5e7eb' }}>
                          <p><strong><FaCalendarAlt /> チェックイン日:</strong> {reservation.checkInDate}</p>
                          <p><strong><FaCalendarAlt /> チェックアウト日:</strong> {reservation.checkOutDate}</p>
                          <p><strong>宿泊日数:</strong> {reservation.stayDays} 泊</p>
                          <p><strong>プラン名:</strong> {booking?.name ?? '不明'}</p>
                          <p><strong><FaClipboardList /> ステータス:</strong> {reservation.status}</p>

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setReservationModalOpen(true);
                            }}
                          >
                            <FaEdit /> この予約を編集
                          </button>
                        </div>
                      );
                    })}
                  </details>
                </div>
              );
            })}
          </div>
        </div>

        {/* モーダルたち */}
        {guestModalOpen && selectedGuestDetail && (
          <EditGuestModal
            guestDetail={selectedGuestDetail}
            onClose={() => {
              setGuestModalOpen(false);
              setSelectedGuestDetail(null);
              handleSearch(); // 再読込
            }}
          />
        )}

        {reservationModalOpen && selectedReservation && (
          <EditReservationModal
            reservation={selectedReservation}
            onClose={() => {
              setReservationModalOpen(false);
              setSelectedReservation(null);
              handleSearch(); // 再読込
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SearchGuestPage;