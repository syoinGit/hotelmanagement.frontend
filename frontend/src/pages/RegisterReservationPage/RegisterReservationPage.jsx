import React, { useState } from "react";
import axios from "axios";
import RegisterModal from "../../components/Modal/RegisterModal/RegisterModal";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== "undefined" && window.API_BASE) ||
  "http://localhost:8080";

const RegisterReservationPage = () => {
  // 検索フォーム
  const [form, setForm] = useState({
    name: "",
    kanaName: "",
    phone: "",
  });

  // 検索結果
  const [matchedGuest, setMatchedGuest] = useState(null);
  const [searched, setSearched] = useState(false);
  const [info, setInfo] = useState("");

  // モーダル制御
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(null); // "existing" | "new"
  const [modalGuest, setModalGuest] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 完全一致検索（/guest/match は GuestRegistration を返す想定）
  const handleSearch = async () => {
    setSearched(false);
    setMatchedGuest(null);
    setInfo("");

    try {
      const url = `${API_BASE}/guest/match`;
      const res = await axios.post(url, form, { withCredentials: true });

      // GuestRegistration から guest を取り出して保存
      const guest = res?.data?.guest ?? null;
      setMatchedGuest(guest);
      setSearched(true);

      if (guest) {
        setInfo("一致する宿泊者が見つかりました。");
      } else {
        setInfo("一致する宿泊者は見つかりませんでした。新規登録で続行できます。");
      }
    } catch (e) {
      console.error("[match] failed", {
        url: `${API_BASE}/guest/match`,
        err: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
        headers: e?.response?.headers,
      });
      setSearched(true);
      setInfo("検索に失敗しました。入力を確認して再度お試しください。");
    }
  };

  // モーダル起動（既存/新規）
  const openModal = (selectedMode) => {
    setMode(selectedMode);

    const g =
      selectedMode === "existing" && matchedGuest
        // 既存はバックエンドが返した guest を“そのまま”渡す（id等も保持）
        ? matchedGuest
        // 新規は検索フォームの3項目だけ初期セット（他はモーダル側で入力）
        : {
            name: form.name.trim(),
            kanaName: form.kanaName.trim(),
            phone: form.phone.trim(),
          };

    setModalGuest(g);
    setModalOpen(true);
  };

  return (
    <div>
      <h2>宿泊者検索（完全一致）→ 登録</h2>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          type="text"
          name="name"
          placeholder="名前（完全一致）"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="kanaName"
          placeholder="ふりがな（完全一致）"
          value={form.kanaName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="電話番号（完全一致）"
          value={form.phone}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>検索</button>
      </div>

      {searched && (
        <div style={{ marginTop: 12 }}>
          <p>{info}</p>

          {matchedGuest ? (
            <div style={{ background: "#f7f7f7", padding: 12, borderRadius: 6 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>一致した宿泊者</div>
              <div>名前：{matchedGuest.name}</div>
              <div>ふりがな：{matchedGuest.kanaName}</div>
              <div>電話番号：{matchedGuest.phone}</div>

              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <button onClick={() => openModal("existing")}>
                  この宿泊者に追加登録
                </button>
                <button onClick={() => openModal("new")}>
                  新規登録として登録
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => openModal("new")}>
                新規登録として登録
              </button>
            </div>
          )}
        </div>
      )}

      {/* 登録モーダル（情報セット・ロックはモーダル側が自動処理） */}
      <RegisterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        guest={modalGuest}
        mode={mode}
        searchMatched={Boolean(matchedGuest)}
        apiBase={API_BASE}
      />
    </div>
  );
};

export default RegisterReservationPage;