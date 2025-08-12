import React, { useEffect, useState } from 'react';
import './GuestListPage.css';

function GuestList() {
  const [guests, setGuests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // 安全にフィルター処理（null・undefinedチェックも含む）
  const filteredGuests = Array.isArray(guests)
    ? guests.filter((item) =>
        filterStatus === 'ALL'
          ? true
          : item.reservations?.some((res) => res.status === filterStatus)
      )
    : [];

  useEffect(() => {
    async function getGuests() {
      try {
        const response = await fetch('http://localhost:8080/guests', {
          credentials: 'include', // セッション情報を送信
        });
        const data = await response.json();
        setGuests(data);
      } catch (error) {
        console.error('ゲスト一覧の取得に失敗しました', error);
      }
    }

    getGuests();
  }, []);

  return (
    <div className="guest-list-container">
      <h2>宿泊者一覧</h2>

      <div className="filter-box">
        <label>ステータスで絞り込み：</label>
        <select
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

      {filteredGuests.map((item) => (
        <div className="guest-card" key={item.guest.id}>
          <h3>
            {item.guest.name}（{item.guest.phone}）
          </h3>
          <p>
            <strong>メール:</strong> {item.guest.email}
          </p>
          <p>
            <strong>地域:</strong> {item.guest.region}
          </p>
          <p>
            <strong>年齢 / 性別:</strong> {item.guest.age ?? '-'} /{' '}
            {item.guest.gender ?? '-'}
          </p>

          {item.bookings?.length > 0 && (
            <div className="booking-info">
              <strong>予約プラン:</strong>
              <ul>
                {item.bookings.map((booking) => (
                  <li key={booking.id}>
                    {booking.name ?? '名称未定'} - ¥
                    {Number(booking.price ?? 0).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.reservations?.length > 0 && (
            <div className="reservation-info">
              <strong>予約情報:</strong>
              <ul>
                {item.reservations.map((res) => (
                  <li key={res.id} className={`status-${res.status}`}>
                    チェックイン: {res.checkInDate} / 泊数: {res.stayDays} /
                    状態: {res.statusLabel ?? res.status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default GuestList;