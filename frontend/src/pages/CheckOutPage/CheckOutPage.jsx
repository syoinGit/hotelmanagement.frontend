import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CheckOutPage.css';

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== 'undefined' && window.API_BASE) ||
  'http://localhost:8080';

const CheckInPage = () => {
  const [guests, setGuests] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // 本日チェックイン予定の宿泊者一覧取得
  useEffect(() => {
    const fetchTodayGuests = async () => {
      try {
        const res = await axios.get(`${API_BASE}/guests/check-out-today`, {
          withCredentials: true,
        });
        setGuests(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('本日宿泊者の取得失敗:', error);
        setMessage('本日チェックアウト予定の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchTodayGuests();
  }, []);

  // チェックイン処理
  const handleCheckOut = async (reservationId, guestName) => {
  try {
    const res = await axios.put(
      `${API_BASE}/guest/checkOut`,
      {},
      {
        params: { id: reservationId, name: guestName }, // ← Postmanと同じキーに
        withCredentials: true,
      }
    );

    setMessage(typeof res.data === 'string' ? res.data : 'チェックアウト完了');

    setGuests(prev =>
      prev
        .map(g => ({
          ...g,
          reservations: (g.reservations || []).filter(r => r.id !== reservationId),
        }))
        .filter(g => (g.reservations || []).length > 0)
    );
  } catch (error) {
    console.error('チェックアウト失敗:', error);
    const msg =
      error?.response?.data?.message ||
      (typeof error?.response?.data === 'string' ? error.response.data : null) ||
      'チェックアウトに失敗しました。';
    setMessage(msg);
  }
};

  return (
    <div className="check-in-container">
      <h2>本日チェックアウト予定の宿泊者</h2>
      {message && <p className="message">{message}</p>}
      {loading ? (
        <p>読み込み中...</p>
      ) : guests.length === 0 ? (
        <p>本日チェックアウト予定はありません。</p>
      ) : (
        <table className="check-in-table">
          <thead>
            <tr>
              <th>名前</th>
              <th>電話番号</th>
              <th>プラン</th>
              <th>チェックアウト</th>
            </tr>
          </thead>
          <tbody>
            {guests.map(g =>
              (g.reservations || []).map(res => {
                const booking =
                  (g.bookings || []).find(b => b.id === res.bookingId) || null;
                return (
                  <tr key={res.id}>
                    <td>{g.guest?.name ?? ''}</td>
                    <td>{g.guest?.phone ?? ''}</td>
                    <td>{booking ? booking.name : '不明なプラン'}</td>
                    <td>
                      <button onClick={() => handleCheckOut(res.id, g.guest?.name ?? '')}>
                        チェックアウト
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CheckInPage;