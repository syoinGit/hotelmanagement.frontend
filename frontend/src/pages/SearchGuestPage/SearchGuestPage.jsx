import { FaSearch } from 'react-icons/fa';
import React, { useState } from 'react';
import axios from 'axios';
import './SearchGuestPage.css';
import { FaUser, FaBed, FaPhone, FaCalendarAlt, FaClipboardList, FaEdit } from 'react-icons/fa';
import EditGuestModal from '../../components/Modal/EditGuestModal/EditGuestModal';
import EditReservationModal from '../../components/Modal/EditReservationModal/EditReservationModal';
axios.defaults.withCredentials = true;

const SearchGuestPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    kanaName: '',
    phone: '',
    checkInDate: '',
    checkOutDate: ''
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [showCheckedOut, setShowCheckedOut] = useState(false);
  const [selectedGuestDetail, setSelectedGuestDetail] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    try {
      const res = await axios.post('http://localhost:8080/guest/search', formData);
      setResults(res.data ?? []);
      setError('');
    } catch (err) {
      console.error('検索失敗:', err);
      setError('検索に失敗しました');
    }
  };

  return (

    <div className="search-guest-container">
      <div className="form search-form">
        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="名前"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="kanaName"
            placeholder="フリガナ"
            value={formData.kanaName}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            name="phone"
            placeholder="電話番号"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>チェックイン</label>
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
          />
          <label>チェックアウト</label>
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-row form-actions">
          <button className="search-button" onClick={handleSearch}>
            <FaSearch style={{ marginRight: '6px' }} /> 検索する
          </button>
          <button
            className="toggle-button"
            onClick={() => setShowCheckedOut(!showCheckedOut)}
          >
            {showCheckedOut ? 'チェックアウト済みを非表示' : 'チェックアウト済みも表示'}
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}


      <div className="results-container">
        <div className="card-grid">
          {results
            .filter((g) => showCheckedOut || g.reservations?.some((r) => r.status !== 'CHECKED_OUT'))
            .map((guestDetail, index) => {
              const { guest, reservations, bookings } = guestDetail;

              return reservations.map((reservation, i) => {
                const booking = bookings[i];

                return (
                  <div key={`${index}-${i}`} className="reservation-card">
                    <div className="guest-info" style={{ marginBottom: '10px' }}>
                      <h3><FaUser /> 宿泊者情報</h3>
                      <p><strong>名前:</strong> {guest.name}</p>
                      <p><strong>フリガナ:</strong> {guest.kanaName}</p>
                      <p><strong><FaPhone /> 電話番号:</strong> {guest.phone}</p>
                      <button className="edit-button" onClick={() => {
                        setSelectedGuestDetail(guestDetail);
                        setGuestModalOpen(true);
                      }}>
                        <FaEdit /> ゲスト情報を編集
                      </button>
                    </div>

                    <details className="reservation-info" style={{ borderTop: '1px solid #ddd', paddingTop: '10px' }}>
                      <summary><strong><FaBed /> 宿泊情報</strong></summary>
                      <p><strong><FaCalendarAlt /> チェックイン日:</strong> {reservation.checkInDate}</p>
                      <p><strong><FaCalendarAlt /> チェックアウト日:</strong> {reservation.checkOutDate}</p>
                      <p><strong>宿泊日数:</strong> {reservation.stayDays} 泊</p>
                      <p><strong>プラン名:</strong> {booking?.name ?? '不明'}</p>
                      <p><strong><FaClipboardList /> ステータス:</strong> {reservation.status}</p>
                      <button className="edit-button" onClick={() => {
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
        </div>
      </div>

      {guestModalOpen && selectedGuestDetail && (
        <EditGuestModal
          guestDetail={selectedGuestDetail}
          onClose={() => {
            setGuestModalOpen(false);
            setSelectedGuestDetail(null);
            handleSearch();
          }}
        />
      )}

      {reservationModalOpen && selectedReservation && (
        <EditReservationModal
          reservation={selectedReservation}
          onClose={() => {
            setReservationModalOpen(false);
            setSelectedReservation(null);
            handleSearch();
          }}
        />
      )}
    </div>
  );
};

export default SearchGuestPage;