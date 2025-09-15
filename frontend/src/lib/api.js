// src/lib/api.js
import axios from "axios";

// baseURL を空にして相対パス運用（/login 等 → 同一オリジンに飛ぶ）
const api = axios.create({
  baseURL: "",
  withCredentials: true, // セッションCookie送受信を常に有効
});

// 必要ならここで共通エラーハンドリング
// api.interceptors.response.use(
//   (res) => res,
//   (err) => Promise.reject(err)
// );

export default api;