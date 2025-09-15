import React, { useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import RegisterModal from "../../components/Modal/RegisterModal/RegisterModal";
import "./RegisterReservationPage.css";
import API_BASE from "../../utils/apiBase.js";

/** ひらがな/半角カナ → 全角カタカナ へ正規化し、余計な文字を除去 */
const toKatakana = (input) => {
  if (!input) return "";
  // 半角→全角など互換分解で正規化
  let s = input.normalize("NFKC");

  // ひらがな→カタカナ
  s = s.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );

  // 許可する文字：全角カタカナ・長音符・中点・スペース
  s = s.replace(/[^\u30A0-\u30FFー・\s]/g, "");

  // 先頭・末尾のスペースを整える
  return s.trim().replace(/\s{2,}/g, " ");
};

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
    const { name, value } = e.target;

    // フリガナは強制カタカナ入力
    if (name === "kanaName") {
      setForm((prev) => ({ ...prev, kanaName: toKatakana(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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
   if (guest && guest.id) {
  setMatchedGuest(guest);
  setInfo("一致する宿泊者が見つかりました。");
} else {
  setMatchedGuest(null);
  setInfo("一致する宿泊者は見つかりませんでした。新規登録で続行できます。");
}
setSearched(true);

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
  <div className="register-reservation-page">
    <h1 className="page-title">予約登録</h1>
      {/* ====== 検索フォーム：SearchGuestPage と同じ構造/クラス ====== */}
      <div className="form search-form">
        <div className="form-row">
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
            placeholder="フリガナ（全角カタカナ・完全一致）"
            value={form.kanaName}
            onChange={handleChange}
            inputMode="kana" // モバイルにヒント
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="phone"
            placeholder="電話番号（完全一致）"
            value={form.phone}
            onChange={handleChange}
            inputMode="numeric"
          />
        </div>

        <div className="form-row form-actions">
          <button className="search-button" onClick={handleSearch}>
            <FaSearch style={{ marginRight: 6 }} />
            検索する
          </button>
        </div>
      </div>

      {/* ====== 検索結果表示 ====== */}
      {searched && (
        <div className="match-result">
          <p className="match-info">{info}</p>

          {matchedGuest ? (
            <div className="match-card">
              <div className="match-card__title">一致した宿泊者</div>
              <div>名前：{matchedGuest.name}</div>
              <div>フリガナ：{matchedGuest.kanaName}</div>
              <div>電話番号：{matchedGuest.phone}</div>

              <div className="match-card__actions">
                <button className="primary" onClick={() => openModal("existing")}>
                  この宿泊者に追加登録
                </button>
                <button onClick={() => openModal("new")}>
                  新規登録として登録
                </button>
              </div>
            </div>
          ) : (
            <div className="match-card__actions">
              <button className="primary" onClick={() => openModal("new")}>
                新規登録として登録
              </button>
            </div>
          )}
        </div>
      )}

      {/* 登録モーダル */}
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