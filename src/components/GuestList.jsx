import React, { useEffect, useState } from 'react';

function GuestList() {
  const [guests, setGuests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredGuests = guests.filter((item) => {
    if (filterStatus === 'ALL') return true;
    return item.reservations.some(res => res.status === filterStatus);
  });

  useEffect(() => {
    async function getGuests() {
      try {
        const response = await fetch('http://localhost:8080/guestList');
        const data = await response.json();
        setGuests(data);
      } catch (error) {
        console.error('ゲスト一覧の取得に失敗しました', error);
      }
    }

    getGuests();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontFamily: 'Arial', color: '#2c3e50' }}>
        宿泊者一覧
      </h2>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label style={{ marginRight: '10px' }}>ステータスで絞り込み:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="ALL">すべて表示</option>
          <option value="TEMPORARY">仮予約</option>
          <option value="NOT_CHECKED_IN">未チェックイン</option>
          <option value="CHECKED_IN">チェックイン済み</option>
          <option value="CHECKED_OUT">チェックアウト済み</option>
          <option value="CANCELLED">キャンセル済み</option>
        </select>
      </div>
      {filteredGuests.map((item) => (
        <div
          key={item.guest.id}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '20px',
            marginBottom: '20px',
            fontFamily: 'Arial'
          }}
        >
          <h3 style={{ color: '#34495e', marginBottom: '10px' }}>
            {item.guest.name}（{item.guest.phone}）
          </h3>
          <p><strong>メール:</strong> {item.guest.email}</p>
          <p><strong>地域:</strong> {item.guest.region}</p>
          <p><strong>年齢 / 性別:</strong> {item.guest.age ?? '-'} / {item.guest.gender ?? '-'}</p>

          {item.bookings?.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <strong style={{ color: '#2980b9' }}>予約プラン:</strong>
              <ul style={{ paddingLeft: '20px' }}>
                {item.bookings.map((booking) => (
                  <li key={booking.id}>
                    {booking.name ?? '名称未定'} - <span style={{ color: '#27ae60' }}>¥{Number(booking.price ?? 0).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.reservations?.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <strong style={{ color: '#8e44ad' }}>予約情報:</strong>
              <ul style={{ paddingLeft: '20px' }}>
                {item.reservations.map((res) => (
                  <li key={res.id}>
                    チェックイン日: {res.checkInDate} / 泊数: {res.stayDays} / 状態: {res.statusLabel ?? res.status}
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