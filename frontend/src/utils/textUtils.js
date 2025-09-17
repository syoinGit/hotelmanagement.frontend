/** 入力を強制的に全角カタカナへ変換 */
export const toKatakana = (input) => {
  if (!input) return "";
  let s = input.normalize("NFKC"); // 半角→全角
  s = s.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60) // ひらがな→カタカナ
  );
  // 許可する文字だけ残す（全角カタカナ・長音符・中点・スペース）
  s = s.replace(/[^\u30A0-\u30FFー・\s]/g, "");
  return s.trim().replace(/\s{2,}/g, " ");
};