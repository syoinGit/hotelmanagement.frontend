import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import API_BASE from '../../../utils/apiBase';
import '../EditGuestModal/EditGuestModal.css';

axios.defaults.withCredentials = true;

const EditBookingModal = ({ bookingDetail, onClose }) => {
  const isEdit = !!bookingDetail;

  // どの形で来ても吸収する正規化関数
  const resolveBooking = (src) => {
    if (!src) return null;
    const b = src.booking ?? src; // { booking: {...} } or { ... }
    return {
      id: b?.id ?? '',
      name: b?.name ?? '',
      description: b?.description ?? '',
      price: b?.price ?? '',
      isAvailable: b?.isAvailable ?? true,
      userId: b?.userId ?? '',
    };
  };

  const booking = useMemo(() => resolveBooking(bookingDetail), [bookingDetail]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    userId: '',
    isAvailable: true,
  });

  useEffect(() => {
    if (!booking) return;
    setFormData(booking);
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: formData.id || undefined,
        name: formData.name,
        description: formData.description,
        price: formData.price,      // BigDecimal文字列として送る
        userId: formData.userId,
        isAvailable: formData.isAvailable,
      };

      if (isEdit) {
        await axios.put(`${API_BASE}/booking/update`, payload);
      } else {
        await axios.post(`${API_BASE}/booking/create`, payload);
      }
      alert('保存しました');
      onClose?.();
    } catch (err) {
      console.error('❌ Booking 保存エラー:', err);
      alert('保存に失敗しました');
    }
  };

  // 論理削除 = isAvailableトグル（サーバ側でトグル）
  const handleToggleAvailable = async () => {
    if (!formData.id) {
      alert('IDが存在しません。再読み込みしてからお試しください。');
      console.warn('⚠️ booking id missing in modal:', { formData, bookingDetail });
      return;
    }
    try {
      // デバッグ用ログ（必要なければ外してOK）
      console.log('PUT /booking/deleted', { id: formData.id, name: formData.name });

      const res = await axios.put(`${API_BASE}/booking/deleted`, null, {
        params: { id: formData.id, name: formData.name },
      });
      alert(res?.data ?? '更新しました');
      onClose?.();
    } catch (err) {
      console.error('❌ Booking 利用可否トグルエラー:', err);
      alert('利用可否の変更に失敗しました');
    }
  };

  if (!isEdit && !bookingDetail) {
    // 新規モードでも開けるようにしたいならこのガードは削除可
    // ここでは従来仕様に合わせて編集時のみ開く想定
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3 className="modal-title">
          {isEdit ? 'プラン（Booking）を編集' : 'プラン（Booking）を作成'}
        </h3>

        <div className="form-grid">
          <label className="form-label">プラン名</label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label className="form-label">説明</label>
          <textarea
            className="form-input"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />

          <label className="form-label">料金（円）</label>
          <input
            className="form-input"
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="例）8800.00"
          />
        </div>

        <div className="modal-buttons">
          <button className="btn primary" onClick={handleSave}>
            保存
          </button>

          {isEdit && (
            <button
              className={formData.isAvailable ? 'btn danger' : 'btn ghost'}
              onClick={handleToggleAvailable}
              title={formData.isAvailable ? '利用停止にする' : '利用可能に戻す'}
            >
              {formData.isAvailable ? '利用停止にする' : '利用可能に戻す'}
            </button>
          )}

          <button className="btn" onClick={onClose}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;