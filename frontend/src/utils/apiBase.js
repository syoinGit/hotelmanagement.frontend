// src/utils/apiBase.js
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== "undefined" && window.API_BASE) ||
  "";
export default API_BASE;