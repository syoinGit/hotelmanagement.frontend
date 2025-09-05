// src/pages/SearchGuestPage/SearchGuestPage.jsx
import React, { useMemo, useState } from 'react';
import axios from 'axios';
import {
  FaSearch, FaUser, FaBed, FaPhone, FaCalendarAlt, FaClipboardList, FaEdit, FaTrash,
} from 'react-icons/fa';
import './SearchGuestPage.css';
import EditGuestModal from '../../components/Modal/EditGuestModal/EditGuestModal';
import EditReservationModal from '../../components/Modal/EditReservationModal/EditReservationModal';

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
    checkOutDate: '',
  });

  // 結果・状態
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 表示トグル
  const [showCheckedOut, setShowCheckedOut] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);

  // モーダル
  const [selectedGuestDetail, setSelectedGuestDetail] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // いずれか埋まっていれば検索可能
  const canSearch = useMemo(() => {
    const { id, name, kanaName, phone, checkInDate, checkOutDate } = formData;
    return !!(id || name || kanaName || phone || checkInDate || checkOutDate);
  }, [formData]);

  const handleSearch = async () => {
    if (!canSearch) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/guest/search`, {
        ...formData,
        showDeleted,
        showCheckedOut,
      });
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

  const handleClear = () => {
    setFormData({
      id: '',
      name: '',
      kanaName: '',
      phone: '',
      checkInDate: '',
      checkOutDate: '',
    });
    setResults([]);
    setError('');
  };

  return (
    <div className="search-page">
      <div className="search-guest-container">
        <h1 className="page-title">宿泊者検索</h1>

        {/* ===== 検索フォーム ===== */}
        <form className="form search-form" onSubmit={onSubmit}>
          {/* 1行目：名前／フリガナ */}
          <div className="form-grid form-grid--row1">
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

          {/* 2行目：電話番号／チェックイン／チェックアウト */}
          <div className="form-grid form-grid--row2">
            <input
              type="text"
              name="phone"
              placeholder="電話番号"
              value={formData.phone}
              onChange={handleChange}
              aria-label="電話番号"
              inputMode="tel"
            />
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              aria-label="チェックイン日"
            />
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              aria-label="チェックアウト日"
            />
          </div>

          {/* ボタン行（横並び固定 / 狭幅のみ折返し） */}
          <div className="form-actions">
            <button
              type="submit"
              className="search-button"
              disabled={!canSearch || loading}
              title="検索する"
            >
              <FaSearch style={{ marginRight: 6 }} />
              {loading ? '検索中…' : '検索する'}
            </button>

            <button
              type="button"
              className={`ghost-button ${showCheckedOut ? 'is-on' : ''}`}
              onClick={() => setShowCheckedOut((v) => !v)}
              title="チェックアウト済みの予約も含める"
            >
              {showCheckedOut ? 'チェックアウト済みも表示' : 'チェックアウト済みを非表示'}
            </button>

            <button
              type="button"
              className={`ghost-button ${showDeleted ? 'is-on' : ''}`}
              onClick={() => setShowDeleted((v) => !v)}
              title="削除（論理削除）済みも含める"
            >
              {showDeleted ? '削除済みも表示中' : '削除済みも表示'}
            </button>

            <button
              type="button"
              className="ghost-button"
              onClick={handleClear}
              title="入力をクリア"
            >
              入力内容をクリア
            </button>
          </div>
        </form>

        {/* メッセージ */}
        {error && <p className="error">{error}</p>}

        {/* ===== 結果（カード2カラム / 画像②レイアウト） ===== */}
        <div className="results-container">
          <div className="card-grid">
            {results.map((detail, i) => {
              const { guest, reservations = [], bookings = [] } = detail || {};
              if (!guest) return null;

              // 削除済みの非表示
              if (!showDeleted && guest.deleted) return null;

              // 表示対象の予約（チェックアウト済みを除外可）
              const visibleReservations = reservations.filter(
                (r) => showCheckedOut || r.status !== 'CHECKED_OUT'
              );

              return (
                <article
                  key={guest.id || `g-${i}`}
                  className={`sg-card ${guest.deleted ? 'is-deleted' : ''}`}
                >
                  <header className="sg-card__header">
                    <div className="sg-avatar" aria-hidden="true">
                      {String(guest.name || '？').charAt(0)}
                    </div>
                    <div className="sg-head">
                      <div className="sg-title">
                        <FaUser className="sg-ico" />
                        <strong>{guest.name}</strong>
                        {guest.deleted && (
                          <span className="badge-deleted">
                            <FaTrash style={{ marginRight: 4 }} />
                            削除済み
                          </span>
                        )}
                      </div>
                      <div className="sg-sub">
                        <span className="pill">
                          {(() => {
                            // 最新予約からプラン名推定
                            const sorted = [...reservations].sort((a, b) =>
                              (b?.checkInDate ?? '').localeCompare(a?.checkInDate ?? '')
                            );
                            const latest = sorted[0];
                            const found =
                              bookings.find((b) => b?.id === latest?.bookingId)?.name ||
                              bookings[0]?.name;
                            return found || 'プラン不明';
                          })()}
                        </span>
                        <span className="sep">・</span>
                        <span className="tel">
                          <FaPhone className="sg-ico" />
                          {guest.phone || '電話番号未登録'}
                        </span>
                      </div>
                    </div>

                    <div className="sg-actions">
                      <button
                        className="btn ghost"
                        onClick={() => {
                          setSelectedGuestDetail(detail);
                          setGuestModalOpen(true);
                        }}
                      >
                        <FaEdit /> ゲスト編集
                      </button>
                    </div>
                  </header>

                  {/* 予約（ドロップダウン） */}
                  <details className="sg-details">
                    <summary>
                      宿泊情報（{visibleReservations.length}件）
                    </summary>

                    <div className="sg-res-list">
                      {visibleReservations.length === 0 && (
                        <div className="sg-res-empty">表示できる予約がありません。</div>
                      )}

                      {visibleReservations.map((r) => {
                        const booking =
                          bookings.find((b) => b?.id === r?.bookingId) || null;

                        return (
                          <div key={r.id} className="sg-res-row">
                            <div className="sg-res-main">
                              <div className="sg-res-title">
                                <FaBed className="sg-ico" />
                                {booking?.name ?? 'プラン不明'}
                              </div>
                              <div className="sg-res-sub">
                                <span>
                                  <FaCalendarAlt className="sg-ico" />
                                  CI: {r.checkInDate}
                                </span>
                                <span className="sep">/</span>
                                <span>
                                  <FaCalendarAlt className="sg-ico" />
                                  CO: {r.checkOutDate}
                                </span>
                                <span className="sep">/</span>
                                <span>泊数: {r.stayDays}</span>
                                <span className="sep">/</span>
                                <span>
                                  <FaClipboardList className="sg-ico" />
                                  {r.status}
                                </span>
                              </div>
                            </div>
                            <div className="sg-res-actions">
                              <button
                                className="btn outline"
                                onClick={() => {
                                  setSelectedReservation(r);
                                  setReservationModalOpen(true);
                                }}
                              >
                                <FaEdit /> 予約編集
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        </div>

        {/* ===== モーダル ===== */}
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