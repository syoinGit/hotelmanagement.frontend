import React, { useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import RegisterModal from "../../components/Modal/RegisterModal/RegisterModal";
import "./RegisterReservationPage.css";
import API_BASE from "../../utils/apiBase.js";

/** ひらがな/半角カナ → 全角カタカナ へ正規化し、余計な文字を除去 */
const toKatakana = (input) => {
  if (!input) return "";
  let s = input.normalize("NFKC"); // 半角→全角など互換分解で正規化
  // ひらがな→カタカナ（Unicodeで +0x60 シフト）
  s = s.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
  // 許可：全角カタカナ・長音符・中点・スペースのみ
  s = s.replace(/[^\u30A0-\u30FFー・\s]/g, "");
  // スペース整形
  return s.trim().replace(/\s{2,}/g, " ");
};

export default function RegisterReservationPage() {
  // 入力フォーム
  const [form, setForm] = useState({ name: "", kanaName: "", phone: "" });

  // 検索状態
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [matchedGuest, setMatchedGuest] = useState(null);
  const [info, setInfo] = useState("");

  // モーダル
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(null); // "existing" | "new"
  const [modalGuest, setModalGuest] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // フリガナは強制カタカナ
    if (name === "kanaName") {
      setForm((prev) => ({ ...prev, kanaName: toKatakana(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = async () => {
    // 空打ち防止（いずれか入力必須）
    if (!form.name && !form.kanaName && !form.phone) {
      setSearched(true);
      setMatchedGuest(null);
      setInfo("検索条件を1つ以上入力してください。");
      return;
    }

    setSearched(false);
    setMatchedGuest(null);
    setInfo("");
    setLoading(true);

    try {
      const url = `${API_BASE}/guest/match`;
      const res = await axios.post(url, form, { withCredentials: true });
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
      });
      setSearched(true);
      setInfo("検索に失敗しました。入力を確認して再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  // モーダル起動
  const openModal = (selectedMode) => {
    setMode(selectedMode);
    const g =
      selectedMode === "existing" && matchedGuest
        ? matchedGuest // 既存：そのまま（id等保持）
        : {
            // 新規：フォームの値で初期化
            name: form.name.trim(),
            kanaName: form.kanaName.trim(),
            phone: form.phone.trim(),
          };
    setModalGuest(g);
    setModalOpen(true);
  };

  return (
    <div className="rrp">
      {/* 左上タイトル：BookingListPageと統一 */}
      <header className="rrp-header">
        <h1 className="rrp-title">予約登録</h1>
      </header>

      {/* 検索フォーム（白カード） */}
      <section className="rrp-card rrp-search">
        <div className="rrp-row">
          <input
            type="text"
            name="name"
            placeholder="名前（完全一致）"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
          />
          <input
            type="text"
            name="kanaName"
            placeholder="フリガナ（全角カタカナ・完全一致）"
            value={form.kanaName}
            onChange={handleChange}
            inputMode="kana"
            autoComplete="off"
          />
          <input
            type="text"
            name="phone"
            placeholder="電話番号（完全一致）"
            value={form.phone}
            onChange={handleChange}
            inputMode="numeric"
            autoComplete="off"
          />
        </div>

        <div className="rrp-actions">
          <button className="btn primary" onClick={handleSearch} disabled={loading}>
            <FaSearch style={{ marginRight: 8 }} aria-hidden />
            {loading ? "検索中…" : "検索する"}
          </button>
        </div>
      </section>

      {/* 結果表示 */}
      {searched && (
        <section className="rrp-result">
          <p className="rrp-info">{info}</p>

          {matchedGuest ? (
            <div className="rrp-card rrp-match">
              <div className="rrp-match__head">
                <div className="badge">{String(matchedGuest.name || "？").charAt(0)}</div>
                <div className="rrp-match__title">一致した宿泊者</div>
              </div>

              <div className="rrp-match__grid">
                <div><span className="label">名前</span>：{matchedGuest.name}</div>
                <div><span className="label">フリガナ</span>：{matchedGuest.kanaName}</div>
                <div><span className="label">電話番号</span>：{matchedGuest.phone}</div>
              </div>

              <div className="rrp-match__actions">
                <button className="btn primary" onClick={() => openModal("existing")}>
                  この宿泊者に追加登録
                </button>
                <button className="btn ghost" onClick={() => openModal("new")}>
                  新規登録として登録
                </button>
              </div>
            </div>
          ) : (
            <div className="rrp-match__actions only">
              <button className="btn primary" onClick={() => openModal("new")}>
                新規登録として登録
              </button>
            </div>
          )}
        </section>
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
}