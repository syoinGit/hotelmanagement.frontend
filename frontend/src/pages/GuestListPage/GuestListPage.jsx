// src/pages/GuestListPage/GuestListPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import EditGuestModal from '../../components/Modal/EditGuestModal/EditGuestModal';
import EditReservationModal from '../../components/Modal/EditReservationModal/EditReservationModal.tsx';
import './GuestListPage.css';
import API_BASE from "../../utils/apiBase.js";
import { toKatakana, useKanaHandlers } from "../../utils/textUtils.js";

const PAGE_SIZE = 20;

export default function GuestList() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const [q, setQ] = useState({
    name: '',
    kanaName: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
  });

  const setKanaQuery = (next) => setQ((prev) => ({ ...prev, kanaName: next }));
  const kana = useKanaHandlers(q.kanaName, setKanaQuery);

  const [showDeleted, setShowDeleted] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(1);

  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedGuestDetail, setSelectedGuestDetail] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const [expanded, setExpanded] = useState(() => new Set());
  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 初回取得
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/guests`, { credentials: 'include' });
        const data = await res.json();
        setGuests(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErr('ゲスト一覧の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const canSearch = useMemo(() => {
    const { name, kanaName, phone, checkInDate, checkOutDate } = q;
    return !!(name || kanaName || phone || checkInDate || checkOutDate);
  }, [q]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setErr('');
      const payload = {
        ...q,
        kanaName: toKatakana(q.kanaName),
        showDeleted,
      };
      const url = canSearch ? `${API_BASE}/guest/search` : `${API_BASE}/guests`;
      const opt = canSearch
        ? {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        : { credentials: 'include' };
      const res = await fetch(url, opt);
      const data = await res.json();
      setGuests(Array.isArray(data) ? data : []);
      setPage(1);
    } catch (e) {
      console.error(e);
      setErr('検索に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQ({ name: '', kanaName: '', phone: '', checkInDate: '', checkOutDate: '' });
    setFilterStatus('ALL');
    setPage(1);
  };

  const baseVisible = useMemo(() => {
    return showDeleted ? guests : guests.filter((g) => !g?.guest?.deleted);
  }, [guests, showDeleted]);

  const filtered = useMemo(() => {
    if (filterStatus === 'ALL') return baseVisible;
    return baseVisible.filter((g) =>
      (g.reservations ?? []).some((r) => r?.status === filterStatus)
    );
  }, [baseVisible, filterStatus]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filtered.slice(start, end);

  const resolveHeader = (detail) => {
    const { guest, reservations = [], bookings = [] } = detail ?? {};
    const name = guest?.name ?? '不明なゲスト';
    const phone = guest?.phone || '電話番号未登録';
    const kana = guest?.kanaName || '';
    const sorted = [...reservations].sort((a, b) =>
      (b?.checkInDate ?? '').localeCompare(a?.checkInDate ?? '')
    );
    const latest = sorted[0];
    const plan =
      bookings.find((b) => b?.id === latest?.bookingId)?.name ??
      (bookings[0]?.name || 'プラン不明');
    return { name, kana, phone, plan };
  };

  const refetch = async () => {
    try {
      const url = canSearch ? `${API_BASE}/guest/search` : `${API_BASE}/guests`;
      const opt = canSearch
        ? {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...q,
              kanaName: toKatakana(q.kanaName),
              showDeleted,
            }),
          }
        : { credentials: 'include' };
      const res = await fetch(url, opt);
      const data = await res.json();
      setGuests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('再取得失敗', e);
    }
  };

  return (
    <div className="guest-list-page">
      <header className="gl-header">
        <h1 className="gl-title">宿泊者一覧</h1>
      </header>

      {/* 検索フォーム */}
      <section className="gl-toolbar">
        <div className="gl-form-grid gl-form-grid--with-actions">
          <input
            type="text"
            placeholder="名前"
            value={q.name}
            onChange={(e) => setQ((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input type="text" placeholder="フリガナ" {...kana} />
          <input
            type="text"
            placeholder="電話番号"
            value={q.phone}
            onChange={(e) => setQ((prev) => ({ ...prev, phone: e.target.value }))}
            inputMode="tel"
          />
          <input
            type="date"
            value={q.checkInDate}
            onChange={(e) => setQ((prev) => ({ ...prev, checkInDate: e.target.value }))}
          />
          <input
            type="date"
            value={q.checkOutDate}
            onChange={(e) => setQ((prev) => ({ ...prev, checkOutDate: e.target.value }))}
          />

          <button className="btn primary btn-icon" onClick={handleSearch}>
            🔍
          </button>
          <button className="btn ghost btn-icon" onClick={handleClear}>
            🗑️
          </button>
        </div>
      </section>

      {/* 絞り込み */}
      <section className="gl-filterbar">
        <div className="gl-filter-row">
          <div className="gl-status-filter">
            <label>ステータス：</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">すべて</option>
              <option value="TEMPORARY">仮予約</option>
              <option value="NOT_CHECKED_IN">未チェックイン</option>
              <option value="CHECKED_IN">チェックイン済み</option>
              <option value="CHECKED_OUT">チェックアウト済み</option>
              <option value="CANCELLED">キャンセル済み</option>
            </select>
          </div>

          <div className="gl-deleted-filter">
            <label>表示：</label>
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

      <div className="gl-count">
        全{total}件中 {total ? start + 1 : 0}-{Math.min(end, total)}件を表示
      </div>

      {loading && <div className="gl-state">読み込み中…</div>}
      {err && <div className="gl-error">{err}</div>}

      {!loading && !err && (
        <>
          <div className="yt-list">
            {pageItems.length === 0 && <div className="gl-empty">該当する宿泊者がいません。</div>}

            {pageItems.map((gd, i) => {
              const { guest, reservations = [], bookings = [] } = gd ?? {};
              const head = resolveHeader(gd);
              const guestId = guest?.id || String(i);
              const isOpen = expanded.has(guestId);

              return (
                <article className="yt-row" key={guestId}>
                  <div
                    className={`yt-main ${isOpen ? 'expanded' : ''}`}
                    onClick={(e) => {
                      const t = e.target;
                      if (t instanceof Element && t.closest('.yt-actions-inline')) return;
                      toggleExpand(guestId);
                    }}
                  >
                    <div className="yt-avatar">{String(head.name || '？').charAt(0)}</div>

                    <div className="yt-texts">
                      <div className="yt-title yt-title-name">{head.name}</div>
                      <div className="yt-sub">
                        {head.kana && <span className="yt-kana">{head.kana}</span>}
                        <span className="yt-dot">・</span>
                        <span className="yt-phone">{head.phone}</span>
                        {head.plan && (
                          <>
                            <span className="yt-dot">・</span>
                            <span>{head.plan}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="yt-expand-hint">
                      {isOpen ? '▼ 宿泊予約を閉じる' : `▶ 宿泊予約を表示（${reservations.length}件）`}
                    </div>

                    <div className="yt-actions-inline">
                      <button
                        className="btn outline btn-sm"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setSelectedGuestDetail(gd);
                          setGuestModalOpen(true);
                        }}
                      >
                        宿泊者編集
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="yt-expand">
                      <div className="gl-reservations">
                        {reservations.map((r) => {
                          const booking = bookings.find((b) => b?.id === r?.bookingId) || {};
                          return (
                            <div className="gl-res-row" key={r.id}>
                              <div className="gl-res-main">
                                <div className="gl-res-title">{booking?.name ?? 'プラン不明'}</div>
                                <div className="gl-res-sub">
                                  IN: {r.checkInDate} / OUT: {r.checkOutDate} / 泊数: {r.stayDays} / 状況: {r.status}
                                </div>
                              </div>
                              <div className="gl-res-actions">
                                <button
                                  className="btn outline"
                                  onClick={() => {
                                    setSelectedReservation(r);
                                    setReservationModalOpen(true);
                                  }}
                                >
                                  予約編集
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="gl-pager">
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
      {guestModalOpen && selectedGuestDetail && (
        <EditGuestModal
          guestDetail={selectedGuestDetail}
          onClose={async () => {
            setGuestModalOpen(false);
            setSelectedGuestDetail(null);
            await refetch();
          }}
        />
      )}

      {reservationModalOpen && selectedReservation && (
        <EditReservationModal
          reservation={selectedReservation}
          onClose={async () => {
            setReservationModalOpen(false);
            setSelectedReservation(null);
            await refetch();
          }}
          onUpdate={async () => await refetch()} // ✅ 追加：通信エラー防止
        />
      )}
    </div>
  );
}