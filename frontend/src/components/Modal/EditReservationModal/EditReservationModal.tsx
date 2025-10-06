import React, { useState } from "react";
import Reservation from "../../../models/Reservation";
import API_BASE from "../../../utils/apiBase";

type Props = {
  reservation: Reservation;
  onClose: () => void;
  onUpdate: (formData: Reservation) => void;
};

const EditReservationModal = ({ reservation, onClose, onUpdate }: Props) => {
  const [formData, setFormData] = useState<Reservation>(reservation);

  // 入力変更処理
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "stayDays" || name === "totalPrice"
          ? Number(value)
          : value,
    }));
  };

  // 更新処理
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_BASE}/reservation/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();

      if (!response.ok) {
        alert("更新に失敗しました: " + text);
        return;
      }

      alert(`${text}`);
      onUpdate(formData);
      onClose();
    } catch (err) {
      console.error("❌ 通信エラー", err);
      alert("通信エラーが発生しました");
    }
  };

  // HTML
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>宿泊予約を編集</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label>
            チェックイン日：
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
            />
          </label>

          <label>
            宿泊日数：
            <input
              type="number"
              name="stayDays"
              value={formData.stayDays}
              onChange={handleChange}
            />
          </label>

          <label>
            宿泊状況：
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="NOT_CHECKED_IN">未チェックイン</option>
              <option value="CHECKED_IN">宿泊中</option>
              <option value="CHECKED_OUT">チェックアウト済み</option>
              <option value="CANCELLED">キャンセル</option>
            </select>
          </label>

          <label>
            メモ：
            <textarea
              name="memo"
              value={formData.memo || ""}
              onChange={handleChange}
            />
          </label>

          <div className="modal-buttons">
            <button type="submit">保存</button>
            <button type="button" onClick={onClose}>
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;