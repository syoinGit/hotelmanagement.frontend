import React from 'react';
import './EditSearchResultModal.css';

const EditSearchResultModal = ({ results, showOnlyUncheckedIn, onEditClick, onClose }) => {
  return (
    <div className="search-result-container">
      <h3 className="modal-title">検索結果</h3>
      <div className="modal-form">
        {results.length === 0 ? (
          <p>該当する宿泊者はいません。</p>
        ) : (
          results.map((item, index) => (
            <div key={index} className="guest-result-group">
              <div className="guest-info-card">
                <h4>宿泊者情報</h4>
                <p><strong>名前:</strong> {item.guest.name} ({item.guest.kanaName})</p>
                <p><strong>電話番号:</strong> {item.guest.phone}</p>
                <p><strong>地域:</strong> {item.guest.region}</p>
                <p><strong>性別:</strong> {item.guest.gender}</p>
                <p><strong>年齢:</strong> {item.guest.age}</p>
                <p><strong>メール:</strong> {item.guest.email}</p>
                <button className="edit-button" onClick={() => onEditClick(item, 'guest')}>編集</button>
              </div>
              {item.reservations
                .filter(reservation => !showOnlyUncheckedIn || reservation.status === "NOT_CHECKED_IN")
                .map((reservation, i) => (
                  <div key={i} className="reservation-info-card">
                    <h5>予約情報</h5>
                    <p><strong>チェックイン日:</strong> {reservation.checkInDate}</p>
                    <p><strong>ステータス:</strong> {reservation.status}</p>
                    <p><strong>合計金額:</strong> ¥{reservation.totalPrice}</p>
                    <p><strong>宿泊日数:</strong> {reservation.stayDays}日</p>
                    <p><strong>メモ:</strong> {reservation.memo}</p>
                    <p><strong>作成日時:</strong> {reservation.createdAt}</p>
                    {item.bookings && item.bookings[i] && (
                      <div className="plan-info">
                        <h6>プラン</h6>
                        <p><strong>プラン名:</strong> {item.bookings[i].name}</p>
                        <p><strong>料金:</strong> ¥{item.bookings[i].price}</p>
                        <p><strong>説明:</strong> {item.bookings[i].description}</p>
                      </div>
                    )}
                    <button className="edit-button" onClick={() => onEditClick(reservation, 'reservation')}>編集</button>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

export default EditSearchResultModal;