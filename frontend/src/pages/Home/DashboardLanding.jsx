import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FaUser, FaBed, FaCalendarAlt } from 'react-icons/fa';
import EditGuestModal from '../../components/Modal/EditGuestModal/EditGuestModal';
import EditReservationModal from '../../components/Modal/EditReservationModal/EditReservationModal.tsx';
import './DashboardLanding.css';
import API_BASE from '../../utils/apiBase.js';

/* =========================
   日付ユーティリティ（JSTベースの素朴実装）
   ========================= */
const toDate = (d) => {
  // 'YYYY-MM-DD' はローカル解釈のズレ防止で T00:00 固定
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(`${d}T00:00:00`);
  return new Date(d);
};

const addDays = (date, days) => {
  const dt = new Date(date.getTime());
  dt.setDate(dt.getDate() + days);
  return dt;
};

// 今日(0時)で切る
const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const fmt = (date) => {
  if (!date || isNaN(date)) return '—';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// レイト判定：チェックイン＋泊数(=予定アウト)が今日0時より前、かつ既にOUT/CANCELでない
const isReservationLate = (r) => {
  if (!r) return false;
  const ci = toDate(r.checkInDate);
  if (isNaN(ci)) return false;
  const plannedOut = addDays(ci, Number(r.stayDays ?? 0));
  const today0 = startOfToday();
  const isAlreadyOut = r.status === 'CHECKED_OUT' || r.status === 'CANCELLED';
  return !isAlreadyOut && plannedOut < today0;
};

const plannedCheckoutDate = (r) => {
  const ci = toDate(r?.checkInDate);
  if (isNaN(ci)) return null;
  return addDays(ci, Number(r?.stayDays ?? 0));
};

const DashboardLanding = () => {
  const [stayGuests, setStayGuests] = useState([]);
  const [checkInTodayList, setCheckInTodayList] = useState([]);
  const [checkOutTodayList, setCheckOutTodayList] = useState([]);

  // モーダル制御
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedGuestDetail, setSelectedGuestDetail] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  /* =========================
     API 呼び出し
     ========================= */
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

  // レイト件数（KPI）
  const lateCount = useMemo(() => {
    let count = 0;
    for (const gd of stayGuests) {
      const reservations = gd?.reservations ?? [];
      for (const r of reservations) {
        if (isReservationLate(r)) count++;
      }
    }
    return count;
  }, [stayGuests]);

  return (
    <div className="dashboard-landing">
      {/* KPI セクション */}
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

        {/* レイトチェックアウト KPI */}
        <div className={`kpi-card ${lateCount > 0 ? 'kpi-card--alert' : ''}`}>
          <div className="kpi-icon kpi-icon--alert">!</div>
          <div className="kpi-meta">
            <div className="kpi-value">{lateCount}</div>
            <div className="kpi-label">レイトチェックアウト</div>
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

              const late = isReservationLate(r);
              const plannedOut = plannedCheckoutDate(r);

              return (
                <article
                  key={r?.id || `${gi}-${ri}`}
                  className={`stay-card ${late ? 'stay-card--late' : ''}`}
                  aria-label={`${guest?.name} の宿泊情報${late ? '（レイト）' : ''}`}
                >
                  <div className="stay-avatar" aria-hidden="true">
                    {String(guest?.name || '？').charAt(0)}
                  </div>

                  <div className="stay-info">
                    <div className="stay-name">
                      {guest?.name ?? '不明なゲスト'}
                      {late && <span className="badge badge--late" title="予定日を過ぎています">レイト</span>}
                    </div>
                    <div className="stay-plan">{booking?.name ?? 'プラン不明'}</div>
                    <div className="stay-dates">
                      <span>IN: {fmt(toDate(r?.checkInDate))}</span>
                      <span> / 予定OUT: {fmt(plannedOut)}</span>
                      {late && <span className="late-note">（要対応）</span>}
                    </div>
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
          onUpdate={() => {
            // ここで親側の再取得等を任意で実行可能（成功後UI更新）
            loadAll();
          }}
        />
      )}
    </div>
  );
};

export default DashboardLanding;