import React, { useState } from 'react';
import EditGuestModal from './EditGuestModal';
import EditReservationModal from './EditReservationModal';
import EditSearchResultModal from './EditSearchResultModal';
import axios from 'axios';
import './SearchGuestPage.css';

const SearchGuestPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    kanaName: '',
    phone: ''
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showOnlyUncheckedIn, setShowOnlyUncheckedIn] = useState(false);

  const handleEditClick = (data, type) => {
    setModalData(data); // item（全体）または reservation
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
    setModalType(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`http://localhost:8080/searchGuest?${params.toString()}`);
      setResults(response.data);
      setError(null);
      setModalType('searchResult');
      setModalOpen(true);
    } catch (err) {
      setError('検索に失敗しました');
      setResults([]);
    }
  };

  const handleToggleUnchecked = () => {
    setShowOnlyUncheckedIn(!showOnlyUncheckedIn);
  };

  return (
    <div className="search-container">
      <h2 className="search-title">宿泊者単一検索</h2>
      <div className="search-form">
        <input name="id" placeholder="ID" value={formData.id} onChange={handleChange} />
        <input name="name" placeholder="名前" value={formData.name} onChange={handleChange} />
        <input name="kanaName" placeholder="ふりがな" value={formData.kanaName} onChange={handleChange} />
        <input name="phone" placeholder="電話番号" value={formData.phone} onChange={handleChange} />
        <button onClick={handleSearch}>検索</button>
      </div>
      <div className="filter-options">
        <label>
          <input
            type="checkbox"
            checked={showOnlyUncheckedIn}
            onChange={handleToggleUnchecked}
          />
          未チェックインの予約のみ表示
        </label>
      </div>
      {results.length > 0 && (
        <EditSearchResultModal
          results={results}
          showOnlyUncheckedIn={showOnlyUncheckedIn}
          onEditClick={handleEditClick}
          onClose={handleCloseModal}
        />
      )}
      {error && <p className="error-message">{error}</p>}
      <a href="/" className="back-to-home">Homeに戻る</a>

      {isModalOpen && modalType === 'guest' && (
        <EditGuestModal
          guestDetail={modalData}
          onClose={handleCloseModal}
        />
      )}
      {isModalOpen && modalType === 'reservation' && (
        <EditReservationModal
          reservation={modalData}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SearchGuestPage;