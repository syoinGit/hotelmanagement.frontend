import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

// API ベースURL（CRA/webpack でも動く形）
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== "undefined" && window.API_BASE) ||
  "http://localhost:8080";

/**
 * 宿泊者登録モーダル
 * - GuestRegistration DTO に準拠して /guest/register に PUT
 * - モーダルオープン時に /guest/register/defaults を取得し、
 *   初期値を自動セット＋値の入った項目はロック（編集不可）にする
 * - Booking は /bookings から {id, name} を取得して名前で選択 → bookingId にUUIDを設定
 * - 性別は /meta/genders（任意）から取得。無ければ ["男","女","その他"] を使用
 *
 * props:
 *  - open: boolean
 *  - onClose: () => void
 *  - guest: object|null
 *  - mode: "existing"|"new"|null
 *  - searchMatched?: boolean 検索成功フラグ（成功: true / 失敗: false）
 */
const RegisterModal = ({ open, onClose, guest, mode = null, searchMatched = false }) => {
  // ===== 性別の正規化 =====
  const normalizeGenderToUI = (g) => {
    if (!g) return "";
    const s = String(g).trim().toLowerCase();
    if (["男", "男性", "male", "m"].includes(s)) return "男";
    if (["女", "女性", "female", "f"].includes(s)) return "女";
    return "その他";
  };
  // API へ送るときの表記（バックエンドが "男性/女性/その他" 前提ならここで合わせる）
  const normalizeGenderToAPI = (g) => {
    const ui = normalizeGenderToUI(g);
    if (ui === "男") return "男性";
    if (ui === "女") return "女性";
    return "その他";
  };

  // GuestRegistration DTO に合わせた state
  const [registration, setRegistration] = useState({
    guest: guest ?? null,
    bookingId: "",
    stayDays: 1,
    checkInDate: "",
    memo: "",
  });

  // 値が入った項目のロック状態（デフォルト or 既存値により）
  const [locks, setLocks] = useState({
    bookingId: false,
    stayDays: false,
    checkInDate: false,
    memo: false,
  });

  // Booking候補 / 性別候補
  const [bookingOptions, setBookingOptions] = useState([]); // [{id, name}]
  const [bookingFetchErr, setBookingFetchErr] = useState("");
  const [genderOptions, setGenderOptions] = useState(["男", "女", "その他"]);
  const [genderFetchErr, setGenderFetchErr] = useState("");

  // guest prop が更新されたら state に反映（不足フィールドは初期化）
  useEffect(() => {
    setRegistration((prev) => ({
      ...prev,
      guest: guest
        ? {
            name: guest.name ?? "",
            kanaName: guest.kanaName ?? "",
            gender: normalizeGenderToUI(guest.gender ?? ""),
            age: guest.age ?? "",
            region: guest.region ?? "",
            email: guest.email ?? "",
            phone: guest.phone ?? "",
          }
        : {
            name: "",
            kanaName: "",
            gender: "",
            age: "",
            region: "",
            email: "",
            phone: "",
          },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guest]);

  // モーダルが開いたらデフォルト値 / プラン一覧 / 性別候補 を取得
  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const url = `${API_BASE}/guest/register/defaults`;
        const res = await axios.get(url, { withCredentials: true });
        const defaults = res.data || {};

        // 既存値を尊重しつつ、空のところにデフォルトを流し込む
        setRegistration((prev) => {
          const next = {
            ...prev,
            bookingId: prev.bookingId || defaults.bookingId || "",
            stayDays:
              prev.stayDays != null && prev.stayDays !== ""
                ? prev.stayDays
                : defaults.stayDays ?? 1,
            checkInDate: prev.checkInDate || defaults.checkInDate || "",
            memo: prev.memo || defaults.memo || "",
          };
          setLocks({
            bookingId: !!next.bookingId,
            stayDays: next.stayDays != null && String(next.stayDays) !== "",
            checkInDate: !!next.checkInDate,
            memo: !!next.memo,
          });
          return next;
        });
      } catch {
        // 失敗してもスルー（手入力は可能）
        setLocks((prev) => ({
          bookingId: !!registration.bookingId,
          stayDays: false,
          checkInDate: false,
          memo: !!registration.memo,
        }));
      }
    };

    const fetchBookingOptions = async () => {
      try {
        setBookingFetchErr("");
        const url = `${API_BASE}/bookings`;
        const res = await axios.get(url, { withCredentials: true });
        const listRaw = Array.isArray(res.data) ? res.data : [];
        const list = listRaw.map((b) => ({
          id: b.id,
          name: b.name ?? b.planName ?? b.title ?? b.id,
        }));
        setBookingOptions(list);
      } catch {
        setBookingFetchErr("予約プランの取得に失敗しました。手入力で続行してください。");
        setBookingOptions([]);
      }
    };

    const fetchGenders = async () => {
      try {
        setGenderFetchErr("");
        // 任意のメタAPI。無ければフォールバックへ
        const url = `${API_BASE}/meta/genders`;
        const res = await axios.get(url, { withCredentials: true });
        const listRaw = Array.isArray(res.data) ? res.data : [];
        const normalized = listRaw
          .map((x) => (typeof x === "string" ? x : x?.name))
          .filter(Boolean)
          .map(normalizeGenderToUI);
        if (normalized.length > 0) setGenderOptions(normalized);
      } catch {
        // そのままフォールバック（["男","女","その他"]）
        setGenderFetchErr("");
      }
    };

    if (open) {
      fetchDefaults();
      fetchBookingOptions();
      fetchGenders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const todayStr = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }, []);

  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // フロントのバリデーションは最小限（必須・型程度）
  const validate = () => {
    const e = {};

    // BookingId 必須＆UUID
    if (!registration.bookingId) {
      e.bookingId = "予約プランは必須です";
    } else if (!uuidRegex.test(registration.bookingId)) {
      e.bookingId = "予約IDはUUID形式である必要があります";
    }

    // チェックイン日
    if (!registration.checkInDate) {
      e.checkInDate = "チェックイン日は必須です";
    } else if (registration.checkInDate < todayStr) {
      e.checkInDate = "チェックイン日に過去の日付は使用できません";
    }

    // 滞在日数
    const stayNum = Number(registration.stayDays);
    if (!stayNum || stayNum < 1) {
      e.stayDays = "滞在日は1以上で入力してください";
    }

    // Guest 必須フィールド（パターン等はサーバに委譲）
    const g = registration.guest || {};
    if (!g.name || !g.name.trim()) e.name = "名前は必須です";
    if (!g.kanaName || !g.kanaName.trim()) e.kanaName = "ふりがなは必須です";
    if (!g.gender || !g.gender.trim()) e.gender = "性別は必須です";
    if (g.age === "" || g.age === null || g.age === undefined) {
      e.age = "年齢は必須です";
    } else if (Number(g.age) < 0) {
      e.age = "年齢は0以上である必要があります";
    }
    if (!g.region || !g.region.trim()) e.region = "地域は必須です";
    if (!g.email || !g.email.trim()) e.email = "メールアドレスは必須です";
    if (!g.phone || !g.phone.trim()) e.phone = "電話番号は必須です";

    if (registration.guest == null) e.guest = "ゲスト情報がありません";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // サーバのバリデーションを UI に反映（Springの典型形/汎用）
  const applyServerErrors = (data) => {
    const e = {};

    if (data?.errors && typeof data.errors === "object") {
      for (const [k, v] of Object.entries(data.errors)) {
        const key = k.replace(/^guest\./, "");
        e[key] = Array.isArray(v) ? v.join(" / ") : String(v);
      }
    } else if (Array.isArray(data?.fieldErrors)) {
      data.fieldErrors.forEach((fe) => {
        if (!fe) return;
        const key = String(fe.field || "").replace(/^guest\./, "");
        if (!key) return;
        e[key] = fe.message || fe.defaultMessage || "入力内容をご確認ください";
      });
    } else if (typeof data?.message === "string") {
      setMessage(data.message);
    }

    if (Object.keys(e).length > 0) setErrors(e);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const body = {
        guest: {
          ...registration.guest,
          gender: normalizeGenderToAPI(registration.guest.gender),
          age: Number(registration.guest.age),
        },
        bookingId: registration.bookingId,
        stayDays: Number(registration.stayDays),
        checkInDate: registration.checkInDate, // yyyy-MM-dd
        memo: registration.memo ?? "",
      };

      const url = `${API_BASE}/guest/register`;
      const res = await axios.put(url, body, { withCredentials: true });

      const msg =
        typeof res.data === "string"
          ? res.data
          : res.data?.message || "宿泊者情報の登録が完了しました。";

      setMessage(msg);
      setTimeout(() => {
        setMessage("");
        onClose?.();
      }, 800);
    } catch (err) {
      const data = err?.response?.data;
      applyServerErrors(data);
      const fallback =
        typeof data === "string"
          ? data
          : data?.message || "登録に失敗しました。入力内容をご確認ください。";
      setMessage(fallback);
    }
  };

  // モーダルを閉じているときはレンダーしない（Hooks評価後）
  if (!open) return null;

  // ロック条件
// 追加登録(existing): ゲスト情報 全ロック
// 新規登録(new): 基本ロックなし。検索失敗時のみ name/kanaName/phone をロック
const guestFullLock = mode === "existing";
const lockNameKanaPhone = mode === "new" && !searchMatched;

  // ===== UI =====
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          minWidth: 420,
          maxWidth: 680,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>宿泊者 登録</h3>

        {/* ゲスト情報 */}
        <div
          style={{
            background: "#f7f7f7",
            padding: 12,
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>ゲスト情報</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label>名前</label>
              <input
                type="text"
                value={registration.guest?.name ?? ""}
                disabled={guestFullLock || lockNameKanaPhone}
                onChange={(e) =>
                  setRegistration({
                    ...registration,
                    guest: { ...registration.guest, name: e.target.value },
                  })
                }
              />
              {errors.name && <div style={{ color: "red", fontSize: 12 }}>{errors.name}</div>}
            </div>

            <div>
              <label>ふりがな</label>
              <input
                type="text"
                value={registration.guest?.kanaName ?? ""}
                disabled={guestFullLock || lockNameKanaPhone}
                onChange={(e) =>
                  setRegistration({
                    ...registration,
                    guest: { ...registration.guest, kanaName: e.target.value },
                  })
                }
              />
              {errors.kanaName && (
                <div style={{ color: "red", fontSize: 12 }}>{errors.kanaName}</div>
              )}
            </div>

            <div>
              <label>性別</label>
              <select
                value={registration.guest?.gender ?? ""}
                disabled={guestFullLock}
                onChange={(e) =>
                  setRegistration({
                    ...registration,
                    guest: { ...registration.guest, gender: e.target.value },
                  })
                }
              >
                <option value="">選択してください</option>
                {genderOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {genderFetchErr && (
                <div style={{ color: "#c47b00", fontSize: 12, marginTop: 4 }}>
                  {genderFetchErr}
                </div>
              )}
              {errors.gender && (
                <div style={{ color: "red", fontSize: 12 }}>{errors.gender}</div>
              )}
            </div>

            <div>
              <label>年齢</label>
              <input
                type="number"
                min={0}
                value={registration.guest?.age ?? ""}
                disabled={guestFullLock}
                onChange={(e) =>
                  setRegistration({
                    ...registration,
                    guest: {
                      ...registration.guest,
                      age: e.target.value !== "" ? Number(e.target.value) : "",
                    },
                  })
                }
              />
              {errors.age && <div style={{ color: "red", fontSize: 12 }}>{errors.age}</div>}
            </div>

            <div>
              <label>地域</label>
              <input
                type="text"
                value={registration.guest?.region ?? ""}
                disabled={guestFullLock}
                onChange={(e) =>
                  setRegistration({
                    ...registration,
                    guest: { ...registration.guest, region: e.target.value },
                  })
                }
              />
              {errors.region && (
                <div style={{ color: "red", fontSize: 12 }}>{errors.region}</div>
              )}
            </div>

            <div>
              <label>メールアドレス</label>
              <input
                type="email"
                value={registration.guest?.email ?? ""}
                disabled={guestFullLock}
                onChange={(e) =>
                  setRegistration({
                    ...registration,
                    guest: { ...registration.guest, email: e.target.value },
                  })
                }
              />
              {errors.email && (
                <div style={{ color: "red", fontSize: 12 }}>{errors.email}</div>
              )}
            </div>

            <div>
              <label>電話番号</label>
              <input
                type="tel"
                value={registration.guest?.phone ?? ""}
                disabled={guestFullLock || lockNameKanaPhone}
                onChange={(e) =>
                  setRegistration({
                    ...registration,
                    guest: { ...registration.guest, phone: e.target.value },
                  })
                }
              />
              {errors.phone && (
                <div style={{ color: "red", fontSize: 12 }}>{errors.phone}</div>
              )}
            </div>
          </div>
        </div>

        {/* 予約情報 */}
        <div
          style={{
            background: "#f7f7f7",
            padding: 12,
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>予約情報</div>

          <div style={{ marginBottom: 10 }}>
            <label>予約プラン</label>
            <br />
            <select
              value={registration.bookingId || ""}
              disabled={locks.bookingId}
              onChange={(e) =>
                setRegistration({ ...registration, bookingId: e.target.value })
              }
            >
              <option value="">選択してください</option>
              {bookingOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name ?? b.id}
                </option>
              ))}
            </select>
            {bookingFetchErr && (
              <div style={{ color: "#c47b00", fontSize: 12, marginTop: 4 }}>
                {bookingFetchErr}
              </div>
            )}
            {errors.bookingId && (
              <div style={{ color: "red", fontSize: 12 }}>{errors.bookingId}</div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label>チェックイン日</label>
              <br />
              <input
                type="date"
                min={todayStr}
                value={registration.checkInDate}
                disabled={locks.checkInDate}
                onChange={(e) =>
                  setRegistration({ ...registration, checkInDate: e.target.value })
                }
              />
              {errors.checkInDate && (
                <div style={{ color: "red", fontSize: 12 }}>
                  {errors.checkInDate}
                </div>
              )}
            </div>

            <div>
              <label>滞在日数</label>
              <br />
              <input
                type="number"
                min={1}
                value={registration.stayDays}
                disabled={locks.stayDays}
                onChange={(e) =>
                  setRegistration({ ...registration, stayDays: e.target.value })
                }
              />
              {errors.stayDays && (
                <div style={{ color: "red", fontSize: 12 }}>{errors.stayDays}</div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <label>メモ</label>
            <br />
            <textarea
              rows={3}
              value={registration.memo}
              disabled={locks.memo}
              onChange={(e) =>
                setRegistration({ ...registration, memo: e.target.value })
              }
            />
          </div>
        </div>

        {/* フッター */}
        <div
          style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 14 }}
        >
          <button onClick={onClose}>閉じる</button>
          <button onClick={handleSubmit}>この内容で登録</button>
        </div>

        {/* メッセージ */}
        {message && (
          <p
            style={{
              marginTop: 10,
              color: /成功|完了/.test(message) ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;