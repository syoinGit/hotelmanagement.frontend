import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingListPage.css';

const BookingListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:8080/bookings', {
          withCredentials: true, // ← 認証セッションを送信
        });
        setBookings(res.data);
      } catch (err) {
        console.error('取得失敗:', err);
        setError('宿泊プランの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="booking-list-container">
      <h2>宿泊プラン一覧</h2>
      <table className="booking-table">
        <thead>
          <tr>
            <th>プラン名</th>
            <th>説明</th>
            <th>価格</th>
            <th>利用可能</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.description || '（なし）'}</td>
              <td>¥{b.price != null ? Number(b.price).toLocaleString() : '未設定'}</td>
              <td>{b.isAvailable ? '○' : '✕'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingListPage;