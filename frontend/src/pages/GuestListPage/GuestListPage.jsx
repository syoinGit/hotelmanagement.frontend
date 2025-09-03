import React, { useEffect, useMemo, useState } from 'react';
import EditGuestModal from '../../components/Modal/EditGuestModal/EditGuestModal';
import EditReservationModal from '../../components/Modal/EditReservationModal/EditReservationModal';
import './GuestListPage.css';

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== 'undefined' && window.API_BASE) ||
  'http://localhost:8080';

const PAGE_SIZE = 20;

function GuestList() {
  const [guests, setGuests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // モーダル制御
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedGuestDetail, setSelectedGuestDetail] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // 一覧取得
  useEffect(() => {
    const getGuests = async () => {
      try {
        setLoading(true);
        setErr('');
        const res = await fetch(`${API_BASE}/guests`, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setGuests(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('ゲスト一覧の取得に失敗しました', e);
        setErr('ゲスト一覧の取得に失敗しました。時間をおいて再度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    getGuests();
  }, []);

  // ステータス絞り込み
  const filtered = useMemo(() => {
    if (filterStatus === 'ALL') return guests;
    return (guests ?? []).filter((g) =>
      (g.reservations ?? []).some((r) => r?.status === filterStatus)
    );
  }, [guests, filterStatus]);

  // ページング
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filtered.slice(start, end);

  // カードの上部（名前/プラン/電話）用：最新予約のプラン名を解決
  const resolveHeader = (detail) => {
    const { guest, reservations = [], bookings = [] } = detail ?? {};
    const name = guest?.name ?? '不明なゲスト';
    const phone = guest?.phone || '電話番号未登録';

    const sorted = [...reservations].sort((a, b) =>
      (b?.checkInDate ?? '').localeCompare(a?.checkInDate ?? '')
    );
    const latest = sorted[0];
    const plan =
      bookings.find((b) => b?.id === latest?.bookingId)?.name ??
      (bookings[0]?.name || 'プラン不明');

    return { name, phone, plan };
  };

  // 絞り込み変更時は先頭ページへ
  useEffect(() => setPage(1), [filterStatus]);

  // 再読込（モーダルクローズ後に呼ぶ）
  const refetch = async () => {
    try {
      const res = await fetch(`${API_BASE}/guests`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setGuests(Array.isArray(data) ? data : []);
    } catch {}
  };

  return (
    <div className="guest-list-page">
      <header className="gl-header">
        <h1 className="gl-title">宿泊者一覧</h1>
        <p className="gl-sub">名前・プラン・電話番号を基準に、ダッシュボードと統一デザインで表示します。</p>
      </header>

      <section className="gl-toolbar">
        <div className="gl-filter">
          <label htmlFor="status">ステータスで絞り込み：</label>
          <select
            id="status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">すべて表示</option>
            <option value="TEMPORARY">仮予約</option>
            <option value="NOT_CHECKED_IN">未チェックイン</option>
            <option value="CHECKED_IN">チェックイン済み</option>
            <option value="CHECKED_OUT">チェックアウト済み</option>
            <option value="CANCELLED">キャンセル済み</option>
          </select>
        </div>
        <div className="gl-count">
          全{total}件中 {total ? start + 1 : 0}-{Math.min(end, total)}件を表示
        </div>
      </section>

      {loading && <div className="gl-state">読み込み中…</div>}
      {err && <div className="gl-error">{err}</div>}

      {!loading && !err && (
        <>
          <div className="gl-list">
            {pageItems.length === 0 && (
              <div className="gl-empty">該当する宿泊者がいません。</div>
            )}

            {pageItems.map((gd, idx) => {
              const head = resolveHeader(gd);
              const { guest, reservations = [], bookings = [] } = gd ?? {};

              return (
                <article key={guest?.id || idx} className="gl-card" aria-label={`${head.name} の情報`}>
                  {/* 左：アバター */}
                  <div className="gl-avatar" aria-hidden="true">
                    {String(head.name || '？').charAt(0)}
                  </div>

                  {/* 中央：基本情報 */}
                  <div className="gl-main">
                    <div className="gl-name">{head.name}</div>
                    <div className="gl-subrow">
                      <span className="gl-pill">{head.plan}</span>
                      <span className="gl-sep">・</span>
                      <span className="gl-phone">{head.phone}</span>
                    </div>

                    {/* 予約（ドロップダウン） */}
                    <details className="gl-details">
                      <summary>予約を表示（{reservations.length}件）</summary>
                      <div className="gl-reservations">
                        {reservations.map((r) => {
                          const booking =
                            bookings.find((b) => b?.id === r?.bookingId) || null;
                          return (
                            <div key={r.id} className="gl-res-row">
                              <div className="gl-res-main">
                                <div className="gl-res-title">
                                  {booking?.name ?? 'プラン不明'}
                                </div>
                                <div className="gl-res-sub">
                                  CI: {r.checkInDate} / CO: {r.checkOutDate} / 泊数: {r.stayDays} / ステータス: {r.status}
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
                        {reservations.length === 0 && (
                          <div className="gl-res-empty">予約情報がありません。</div>
                        )}
                      </div>
                    </details>
                  </div>

                  {/* 右：アクション */}
                  <div className="gl-right">
                    <button
                      className="btn ghost"
                      onClick={() => {
                        setSelectedGuestDetail(gd);
                        setGuestModalOpen(true);
                      }}
                    >
                      ゲスト編集
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* ページネーション */}
          <div className="gl-pager" role="navigation" aria-label="ページ移動">
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
        />
      )}
    </div>
  );
}

export default GuestList;