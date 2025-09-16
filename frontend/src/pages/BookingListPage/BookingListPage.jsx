// src/pages/BookingListPage/BookingListPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import EditBookingModal from '../../components/Modal/EditBookingModal/EditBookingModal';
import './BookingListPage.css';
import API_BASE from "../../utils/apiBase.js";

const PAGE_SIZE = 20;

export default function BookingListPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const [showDeleted, setShowDeleted] = useState(false);

  // ページング
  const [page, setPage] = useState(1);

  // モーダル
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setErr('');
      const res = await fetch(`${API_BASE}/bookings`, { credentials: 'include' });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr('宿泊プランの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  // 削除済みフィルタ
  const visible = useMemo(() => {
    if (showDeleted) return bookings;
    return (bookings ?? []).filter((b) => !b.deleted);
  }, [bookings, showDeleted]);

  // ページング
  const total = visible.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = visible.slice(start, end);

  return (
    <div className="booking-list-page">
      <header className="gl-header">
        <h1 className="gl-title">宿泊プラン一覧</h1>
      </header>

      {/* 削除済みの表示切替 */}
      <section className="gl-filterbar">
        <div className="gl-filter-row">
          <div className="gl-deleted-filter">
            <label style={{ marginRight: 6 }}>表示：</label>
            <select
              value={showDeleted ? 'INCLUDE' : 'EXCLUDE'}
              onChange={(e) => setShowDeleted(e.target.value === 'INCLUDE')}
            >
              <option value="EXCLUDE">削除済みを非表示</option>
              <option value="INCLUDE">削除済みも表示</option>
            </select>
          </div>
        </div>
      </section>

      {/* 件数 */}
      <div className="gl-count">
        全{total}件中 {total ? start + 1 : 0}-{Math.min(end, total)}件を表示
      </div>

      {loading && <div className="gl-state">読み込み中…</div>}
      {err && <div className="gl-error">{err}</div>}

      {!loading && !err && (
        <>
          <div className="yt-list">
            {pageItems.length === 0 && <div className="gl-empty">該当するプランがありません。</div>}

            {pageItems.map((b) => (
              <article className="yt-row" key={b.id}>
                <div className="yt-main">
                  <div className="yt-avatar">{String(b.name || '？').charAt(0)}</div>
                  <div className="yt-texts">
                    <div className="yt-title">{b.name}</div>
                    <div className="yt-sub">
                      {b.description || '説明なし'} ・ 料金:
                      {b.price != null ? `¥${Number(b.price).toLocaleString()}` : '未設定'} ・{' '}
                      {b.isAvailable ? '利用可' : '利用不可'}
                    </div>
                  </div>
                  <div className="yt-actions-inline">
                    <button
                      className="btn ghost"
                      onClick={() => {
                        setSelectedBooking(b);
                        setBookingModalOpen(true);
                      }}
                    >
                      編集
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ページャ */}
          <div className="gl-pager" role="navigation">
            <button
              className="gl-pagebtn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              前へ
            </button>
            <span className="gl-pageinfo">
              {safePage} / {totalPages}
            </span>
            <button
              className="gl-pagebtn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              次へ
            </button>
          </div>
        </>
      )}

      {/* モーダル */}
      {bookingModalOpen && selectedBooking && (
        <EditBookingModal
          bookingDetail={selectedBooking}
          onClose={async () => {
            setBookingModalOpen(false);
            setSelectedBooking(null);
            await fetchAll();
          }}
        />
      )}
    </div>
  );
}