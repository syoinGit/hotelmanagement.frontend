import React, { useEffect, useState } from 'react';
import { FaUser, FaBed, FaPhone, FaCalendarAlt, FaClipboardList, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import EditGuestModal from '../../components/Modal/EditGuestModal/EditGuestModal';
import EditReservationModal from '../../components/Modal/EditReservationModal/EditReservationModal';
import './Home.css';

const Home = () => {
  const [stayGuests, setStayGuests] = useState([]);
  const [selectedGuestDetail, setSelectedGuestDetail] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  const fetchStayGuests = async () => {
    try {
      const res = await axios.get('http://localhost:8080/guests/stay', {
        withCredentials: true,
      });
      setStayGuests(res.data ?? []);
    } catch (err) {
      console.error('❌ 宿泊中ゲストの取得に失敗:', err);
    }
  };

  useEffect(() => {
    fetchStayGuests();
  }, []);

  return (
    <div className="card-grid">
      {stayGuests.map((guestDetail, index) => {
        const { guest, reservations, bookings } = guestDetail;

        return reservations.map((reservation, i) => {
          const booking = bookings[i];

          return (
            <div key={`${index}-${i}`} className="guest-card">
              {/* 宿泊者情報（常時表示） */}
              <div className="guest-info">
                <h3><FaUser /> 宿泊者情報</h3>
                <p><strong>名前:</strong> {guest.name}</p>
                <p><strong>ふりがな:</strong> {guest.kanaName}</p>
                <p><FaPhone /> 電話番号: {guest.phone}</p>
                <button onClick={() => {
                  setSelectedGuestDetail(guestDetail);
                  setGuestModalOpen(true);
                }}>
                  <FaEdit /> ゲスト情報を編集
                </button>
              </div>

              {/* 宿泊情報（ドロップダウン形式のまま） */}
              <details className="reservation-info">
                <summary><FaBed /> 宿泊情報</summary>
                <p><FaCalendarAlt /> 宿泊日: {reservation.checkInDate}</p>
                <p>宿泊日数: {reservation.stayDays}日</p>
                <p>チェックアウト: {reservation.checkOutDate}</p>
                <p>プラン: {booking?.name ?? '不明'}</p>
                <p><FaClipboardList /> ステータス: {reservation.status}</p>
                <button onClick={() => {
                  setSelectedReservation(reservation);
                  setReservationModalOpen(true);
                }}>
                  <FaEdit /> 予約情報を編集
                </button>
              </details>
            </div>
          );
        });
      })}

      {/* モーダル */}
      {guestModalOpen && selectedGuestDetail && (
        <EditGuestModal
          guestDetail={selectedGuestDetail}
          onClose={() => {
            setGuestModalOpen(false);
            setSelectedGuestDetail(null);
            fetchStayGuests();
          }}
        />
      )}

      {reservationModalOpen && selectedReservation && (
        <EditReservationModal
          reservation={selectedReservation}
          onClose={() => {
            setReservationModalOpen(false);
            setSelectedReservation(null);
            fetchStayGuests();
          }}
        />
      )}
    </div>
  );
};

export default Home;