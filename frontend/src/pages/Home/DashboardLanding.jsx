import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaUser, FaBed, FaCalendarAlt } from 'react-icons/fa'; // ← FaHotel を削除
import EditGuestModal from '../../components/Modal/EditGuestModal/EditGuestModal';
import EditReservationModal from '../../components/Modal/EditReservationModal/EditReservationModal';
import './DashboardLanding.css';

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== 'undefined' && window.API_BASE) ||
  'http://localhost:8080';

const DashboardLanding = () => {
  const [stayGuests, setStayGuests] = useState([]);
  const [checkInTodayList, setCheckInTodayList] = useState([]);
  const [checkOutTodayList, setCheckOutTodayList] = useState([]);

  // モーダル制御
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedGuestDetail, setSelectedGuestDetail] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // API呼び出し
  const fetchStayGuests = async () => {
    const res = await axios.get(`${API_BASE}/guests/stay`, { withCredentials: true });
    return res.data ?? [];
  };
  const fetchCheckInToday = async () => {
    const res = await axios.get(`${API_BASE}/guests/check-in-today`, { withCredentials: true });
    return res.data ?? [];
  };
  const fetchCheckOutToday = async () => {
    const res = await axios.get(`${API_BASE}/guests/check-out-today`, { withCredentials: true });
    return res.data ?? [];
  };

  // 初回ロード
  const loadAll = useCallback(async () => {
    try {
      const [stay, ins, outs] = await Promise.all([
        fetchStayGuests(),
        fetchCheckInToday(),
        fetchCheckOutToday(),
      ]);
      setStayGuests(stay);
      setCheckInTodayList(ins);
      setCheckOutTodayList(outs);
    } catch (err) {
      console.error('❌ ダッシュボードデータ取得に失敗:', err);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="dashboard-landing">
      {/* 見出し */}
      <header className="dash-header">
        {/* FaHotel アイコンを削除し、宿泊者ページと同じ見出しフォントに */}
        <h1 className="dash-title">ダッシュボード</h1>
        <p className="sub-text">本日の宿泊状況と最新のステータスを確認・編集できます。</p>
      </header>

      {/* KPI カード */}
      <section className="kpi-section" aria-label="本日の概況">
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--blue"><FaUser /></div>
          <div className="kpi-meta">
            <div className="kpi-value">{stayGuests.length}</div>
            <div className="kpi-label">現在の宿泊者</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--indigo"><FaCalendarAlt /></div>
          <div className="kpi-meta">
            <div className="kpi-value">{checkInTodayList.length}</div>
            <div className="kpi-label">今日のチェックイン予定</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--purple"><FaBed /></div>
          <div className="kpi-meta">
            <div className="kpi-value">{checkOutTodayList.length}</div>
            <div className="kpi-label">今日のチェックアウト予定</div>
          </div>
        </div>
      </section>

      {/* 現在宿泊中 */}
      <section className="stay-section">
        <h2 className="stay-title">現在宿泊中</h2>

        <div className="stay-list">
          {stayGuests.length === 0 && (
            <div className="empty">現在宿泊中のゲストはいません。</div>
          )}

          {stayGuests.map((gd, gi) => {
            const { guest, reservations = [], bookings = [] } = gd ?? {};
            return reservations.map((r, ri) => {
              const booking =
                bookings.find(b => b?.id === r?.bookingId) ?? bookings[ri] ?? null;

              return (
                <article
                  key={r?.id || `${gi}-${ri}`}
                  className="stay-card"
                  aria-label={`${guest?.name} の宿泊情報`}
                >
                  <div className="stay-avatar" aria-hidden="true">
                    {String(guest?.name || '？').charAt(0)}
                  </div>

                  <div className="stay-info">
                    <div className="stay-name">{guest?.name ?? '不明なゲスト'}</div>
                    <div className="stay-plan">{booking?.name ?? 'プラン不明'}</div>
                    <div className="stay-phone">{guest?.phone || '電話番号未登録'}</div>
                  </div>

                  <div className="stay-actions">
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => {
                        setSelectedGuestDetail(gd);
                        setGuestModalOpen(true);
                      }}
                    >
                      ゲスト編集
                    </button>
                    <button
                      type="button"
                      className="btn outline"
                      onClick={() => {
                        setSelectedReservation(r);
                        setReservationModalOpen(true);
                      }}
                    >
                      予約編集
                    </button>
                  </div>
                </article>
              );
            });
          })}
        </div>
      </section>

      {/* モーダル */}
      {guestModalOpen && selectedGuestDetail && (
        <EditGuestModal
          guestDetail={selectedGuestDetail}
          onClose={() => {
            setGuestModalOpen(false);
            setSelectedGuestDetail(null);
            loadAll(); // 再取得
          }}
        />
      )}
      {reservationModalOpen && selectedReservation && (
        <EditReservationModal
          reservation={selectedReservation}
          onClose={() => {
            setReservationModalOpen(false);
            setSelectedReservation(null);
            loadAll(); // 再取得
          }}
        />
      )}
    </div>
  );
};

export default DashboardLanding;