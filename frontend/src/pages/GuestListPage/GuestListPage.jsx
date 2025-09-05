import React, { useEffect, useMemo, useState } from 'react';
import EditGuestModal from '../../components/Modal/EditGuestModal/EditGuestModal';
import EditReservationModal from '../../components/Modal/EditReservationModal/EditReservationModal';
import './GuestListPage.css';

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== 'undefined' && window.API_BASE) ||
  'http://localhost:8080';

const PAGE_SIZE = 20;

export default function GuestList() {
  // 一覧・状態
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // 検索フォーム
  const [q, setQ] = useState({
    name: '',
    kanaName: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
  });

  // 表示トグル
  const [showDeleted, setShowDeleted] = useState(false); // ← 追加：削除済みを表示

  // ステータス絞り込み
  const [filterStatus, setFilterStatus] = useState('ALL');

  // ページング
  const [page, setPage] = useState(1);

  // モーダル
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedGuestDetail, setSelectedGuestDetail] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // 初回: 全件
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const res = await fetch(`${API_BASE}/guests`, { credentials: 'include' });
        const data = await res.json();
        setGuests(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErr('ゲスト一覧の取得に失敗しました。時間をおいて再度お試しください。');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 検索可否
  const canSearch = useMemo(() => {
    const { name, kanaName, phone, checkInDate, checkOutDate } = q;
    return !!(name || kanaName || phone || checkInDate || checkOutDate);
  }, [q]);

  // 検索
  const handleSearch = async () => {
    try {
      setLoading(true);
      setErr('');
      const url = canSearch ? `${API_BASE}/guest/search` : `${API_BASE}/guests`;
      const opt = canSearch
        ? {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...q, showDeleted }), // ← 追加：API にも渡す
          }
        : { credentials: 'include' };
      const res = await fetch(url, opt);
      const data = await res.json();
      setGuests(Array.isArray(data) ? data : []);
      setPage(1);
    } catch (e) {
      console.error(e);
      setErr('検索に失敗しました。入力内容をご確認ください。');
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  // クリア
  const handleClear = () => {
    setQ({ name: '', kanaName: '', phone: '', checkInDate: '', checkOutDate: '' });
    setFilterStatus('ALL');
    setPage(1);
  };

  // 「削除済み」トグルのラベル
  const deletedToggleLabel = showDeleted ? '削除済みを非表示' : '削除済みも表示';

  // 「削除済み」フィルタをまず適用
  const baseVisible = useMemo(() => {
    if (showDeleted) return guests;
    // guest.deleted が真のゲストを非表示
    return (guests ?? []).filter(g => !g?.guest?.deleted);
  }, [guests, showDeleted]);

  // 次にステータス絞り込み
  const filtered = useMemo(() => {
    if (filterStatus === 'ALL') return baseVisible;
    return (baseVisible ?? []).filter((g) =>
      (g.reservations ?? []).some((r) => r?.status === filterStatus)
    );
  }, [baseVisible, filterStatus]);

  // ページング
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filtered.slice(start, end);

  // 見出し用（最新プラン/電話）
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

  // モーダル後の再取得
  const refetch = async () => {
    try {
      const url = canSearch ? `${API_BASE}/guest/search` : `${API_BASE}/guests`;
      const opt = canSearch
        ? {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...q, showDeleted }), // ← 検索条件維持
          }
        : { credentials: 'include' };
      const res = await fetch(url, opt);
      const data = await res.json();
      setGuests(Array.isArray(data) ? data : []);
    } catch {}
  };

  return (
    <div className="guest-list-page">
      <header className="gl-header">
        <h1 className="gl-title">宿泊者一覧</h1>
        <p className="gl-sub">ダッシュボードと同じカードUIで、検索・絞り込み・編集ができます。</p>
      </header>

      {/* 検索ツールバー */}
      <section className="gl-toolbar">
        <div className="gl-form-grid">
          <input
            type="text"
            placeholder="名前"
            value={q.name}
            onChange={(e)=>setQ(prev=>({...prev, name: e.target.value}))}
          />
          <input
            type="text"
            placeholder="フリガナ"
            value={q.kanaName}
            onChange={(e)=>setQ(prev=>({...prev, kanaName: e.target.value}))}
          />
          <input
            type="text"
            placeholder="電話番号"
            value={q.phone}
            onChange={(e)=>setQ(prev=>({...prev, phone: e.target.value}))}
            inputMode="tel"
          />
          <input
            type="date"
            value={q.checkInDate}
            onChange={(e)=>setQ(prev=>({...prev, checkInDate: e.target.value}))}
          />
          <input
            type="date"
            value={q.checkOutDate}
            onChange={(e)=>setQ(prev=>({...prev, checkOutDate: e.target.value}))}
          />
        </div>

        <div className="gl-actions-row">
          <div className="gl-status-filter">
            <label style={{marginRight: 6}}>ステータス：</label>
            <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}>
              <option value="ALL">すべて</option>
              <option value="TEMPORARY">仮予約</option>
              <option value="NOT_CHECKED_IN">未チェックイン</option>
              <option value="CHECKED_IN">チェックイン済み</option>
              <option value="CHECKED_OUT">チェックアウト済み</option>
              <option value="CANCELLED">キャンセル済み</option>
            </select>
          </div>

          <div className="gl-buttons">
            <button className="btn primary" type="button" onClick={handleSearch}>検索する</button>
            <button className="btn ghost" type="button" onClick={handleClear}>クリア</button>
            <button
              type="button"
              className={`btn ghost ${showDeleted ? 'btn-toggle-active' : ''}`}
              aria-pressed={showDeleted}
              onClick={() => setShowDeleted(v => !v)}
              title="削除フラグのあるゲストを表示/非表示"
            >
              {deletedToggleLabel}
            </button>
          </div>
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
            {pageItems.length === 0 && <div className="gl-empty">該当する宿泊者がいません。</div>}

            {pageItems.map((gd, i) => {
              const { guest, reservations = [], bookings = [] } = gd ?? {};
              const head = resolveHeader(gd);

              return (
                <article className="gl-card" key={guest?.id || i}>
                  {/* 上段：左（アバター+名前+電話）/ 右（ゲスト編集） */}
                  <div className="gl-guest-header">
                    <div className="gl-guest-left">
                      <div className="gl-avatar">{String(head.name || '？').charAt(0)}</div>
                      <div className="gl-guest-texts">
                        <div className="gl-guest-top">
                          <span className="gl-guest-name">{head.name}</span>
                          <span className="gl-guest-phone">（{head.phone}）</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="gl-edit-guest-btn"
                      onClick={()=>{
                        setSelectedGuestDetail(gd);
                        setGuestModalOpen(true);
                      }}
                    >
                      ゲスト編集
                    </button>
                  </div>

                  {/* 下段：宿泊予約 */}
                  <details className="gl-details">
                    <summary>宿泊情報（{reservations.length}件）</summary>

                    <div className="gl-reservations">
                      {reservations.length === 0 && (
                        <div className="gl-res-empty">予約情報がありません。</div>
                      )}

                      {reservations.map((r) => {
                        const booking = bookings.find(b=>b?.id===r?.bookingId) || null;
                        const statusJa = (
                          r?.status === 'CHECKED_IN' ? 'チェックイン済み' :
                          r?.status === 'NOT_CHECKED_IN' ? '未チェックイン' :
                          r?.status === 'CHECKED_OUT' ? 'チェックアウト済み' :
                          r?.status === 'TEMPORARY' ? '仮予約' :
                          r?.status === 'CANCELLED' ? 'キャンセル済み' :
                          (r?.status || '-')
                        );
                        return (
                          <div className="gl-res-row" key={r.id}>
                            <div className="gl-res-main">
                              <div className="gl-res-title">{booking?.name ?? 'プラン不明'}</div>
                              <div className="gl-res-sub">
                                チェックイン日: {r.checkInDate} / チェックアウト日: {r.checkOutDate} / 泊数: {r.stayDays} / ステータス: {statusJa}
                              </div>
                            </div>
                            <div className="gl-res-actions">
                              <button
                                className="btn outline"
                                onClick={()=>{
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
                  </details>
                </article>
              );
            })}
          </div>

          {/* ページャ */}
          <div className="gl-pager" role="navigation" aria-label="ページ移動">
            <button className="gl-pagebtn" onClick={()=>setPage(p=>Math.max(1, p-1))} disabled={safePage===1}>前へ</button>
            <span className="gl-pageinfo">{safePage} / {totalPages}</span>
            <button className="gl-pagebtn" onClick={()=>setPage(p=>Math.min(totalPages, p+1))} disabled={safePage===totalPages}>次へ</button>
          </div>
        </>
      )}

      {/* モーダル */}
      {guestModalOpen && selectedGuestDetail && (
        <EditGuestModal
          guestDetail={selectedGuestDetail}
          onClose={async ()=>{
            setGuestModalOpen(false);
            setSelectedGuestDetail(null);
            await refetch();
          }}
        />
      )}
      {reservationModalOpen && selectedReservation && (
        <EditReservationModal
          reservation={selectedReservation}
          onClose={async ()=>{
            setReservationModalOpen(false);
            setSelectedReservation(null);
            await refetch();
          }}
        />
      )}
    </div>
  );
}