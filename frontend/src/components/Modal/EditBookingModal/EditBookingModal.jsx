// src/components/Modal/EditBookingModal/EditBookingModal.jsx
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import API_BASE from '../../../utils/apiBase.js';
import '../EditGuestModal/EditGuestModal.css'; // 既存スタイル流用

axios.defaults.withCredentials = true;

const UUID_RE =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export default function EditBookingModal({ bookingDetail, onClose }) {
  // 編集モード前提（作成エンドポイントは今回使わない）
  const isEdit = !!bookingDetail;

  // どの形で来ても吸収する正規化関数
  const resolveBooking = (src) => {
    if (!src) return null;
    const b = src.booking ?? src; // { booking: {...} } or { ... }
    return {
      id: b?.id ?? '',
      name: b?.name ?? '',
      description: b?.description ?? '',
      price: b?.price ?? '', // 文字列/数値どちらでも受ける
      isAvailable: typeof b?.isAvailable === 'boolean' ? b.isAvailable : true,
      userId: b?.userId ?? '', // サーバ側で上書きされるならそのままでもOK
    };
  };

  const booking = useMemo(() => resolveBooking(bookingDetail), [bookingDetail]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    userId: '',
  });

  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (booking) {
      setFormData(booking);
      setErrorMsg('');
    }
  }, [booking]);

  // 入力変更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 簡易バリデーション（フロント側）
  const validate = () => {
    if (!formData.id || !UUID_RE.test(String(formData.id).trim())) {
      return 'IDはUUID形式である必要があります。';
    }
    if (!formData.name || !String(formData.name).trim()) {
      return 'プラン名は必須です。';
    }
    if (formData.price === '' || formData.price === null || formData.price === undefined) {
      return '料金は必須です。';
    }
    // 数値チェック（BigDecimal送信だが見た目の検証だけ行う）
    const n = Number(formData.price);
    if (Number.isNaN(n)) {
      return '料金は数値で入力してください。';
    }
    return '';
  };

  // 保存（常に /booking/update へ PUT）
  const handleSave = async () => {
    setErrorMsg('');
    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        id: String(formData.id).trim(),
        name: String(formData.name).trim(),
        description: formData.description ?? '',
        price: String(formData.price), // BigDecimal 対策：文字列で送る
        isAvailable: Boolean(formData.isAvailable),
        userId: formData.userId ?? '',
      };

      const res = await axios.put(`${API_BASE}/booking/update`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert((typeof res.data === 'string' ? res.data : res.data?.message) ?? '宿泊プランの更新が完了しました');
      onClose?.();
    } catch (err) {
      console.error('❌ /booking/update エラー:', err);
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : '') ||
        '更新に失敗しました。入力内容をご確認ください。';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  // 論理削除（=利用可否トグル）: /booking/deleted に id と name をクエリで送る
  const handleToggleAvailable = async () => {
    setErrorMsg('');
    if (!formData.id || !UUID_RE.test(String(formData.id).trim())) {
      setErrorMsg('IDはUUID形式である必要があります。');
      return;
    }
    try {
      setToggling(true);
      const res = await axios.put(`${API_BASE}/booking/deleted`, null, {
        params: { id: String(formData.id).trim(), name: formData.name || '' },
      });
      alert((typeof res.data === 'string' ? res.data : res.data?.message) ?? 'プラン情報を変更しました。');
      // サーバ側でトグルされる想定なのでフロントも反転しておく
      setFormData((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
      onClose?.();
    } catch (err) {
      console.error('❌ /booking/deleted エラー:', err);
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : '') ||
        '利用可否の変更に失敗しました。';
      setErrorMsg(msg);
    } finally {
      setToggling(false);
    }
  };

  if (!isEdit || !bookingDetail) {
    // 今回は更新専用モーダルとして扱う（新規作成は別フロー）
    // 必要ならこのガードを外し、新規用UIとPOSTエンドポイントを別途実装してください。
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">プラン（Booking）を編集</h3>

        {errorMsg && (
          <div className="gl-error" style={{ marginBottom: 12 }}>
            {errorMsg}
          </div>
        )}

        <div className="form-grid">
          <label className="form-label">ID（UUID）</label>
          <input
            className="form-input"
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          />

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
            inputMode="decimal"
          />

          <label className="form-label">利用可否（参考表示）</label>
          <input
            className="form-input"
            type="text"
            value={formData.isAvailable ? '利用可能' : '利用停止中'}
            readOnly
          />
        </div>

        <div className="modal-buttons">
          <button className="btn primary" onClick={handleSave} disabled={saving}>
            {saving ? '保存中…' : '保存'}
          </button>

          <button
            className={formData.isAvailable ? 'btn danger' : 'btn ghost'}
            onClick={handleToggleAvailable}
            disabled={toggling || !formData.id}
            title={formData.isAvailable ? '利用停止にする' : '利用可能に戻す'}
          >
            {toggling
              ? '更新中…'
              : formData.isAvailable
              ? '利用停止にする'
              : '利用可能に戻す'}
          </button>

          <button className="btn" onClick={onClose}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}