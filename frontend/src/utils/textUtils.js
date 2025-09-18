// src/utils/textUtils.js
import { useRef } from "react";

/** ひらがな/半角カナ → 全角カタカナへ正規化（不要文字は除去） */
export const toKatakana = (input) => {
  if (!input) return "";
  let s = input.normalize("NFKC"); // 半角→全角など互換分解
  // ひらがな → カタカナ（Unicode +0x60）
  s = s.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
  // 許可：全角カタカナ・長音符・中点・スペースのみ
  s = s.replace(/[^\u30A0-\u30FFー・\s]/g, "");
  // スペース整形
  return s.trim().replace(/\s{2,}/g, " ");
};

/**
 * フリガナ入力用ハンドラ群（IME変換中のチラつき防止）
 * 使い方：
 *   const setKana = (next) => setForm(p => ({ ...p, kanaName: next }));
 *   const kana = useKanaHandlers(form.kanaName, setKana);
 *   <input {...kana} ... />
 */
export const useKanaHandlers = (value, setValue) => {
  const composingRef = useRef(false);

  return {
    value,
    onChange: (e) => {
      const v = e.target.value;
      setValue(composingRef.current ? v : toKatakana(v));
    },
    onCompositionStart: () => {
      composingRef.current = true;
    },
    onCompositionEnd: (e) => {
      composingRef.current = false;
      setValue(toKatakana(e.target.value));
    },
    onBlur: () => {
      setValue(toKatakana(value));
    },
    onPaste: (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData("text");
      setValue(toKatakana(text));
    },
    inputMode: "kana",
    autoComplete: "off",
  };
};