import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const deleteAllCookies = () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(
          /=.*/,
          `=;expires=${new Date(0).toUTCString()};path=/`
        );
    });
  };

  const handleLogout = () => {
    try {
      deleteAllCookies();
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error("Logout cleanup error:", e);
    } finally {
      setOpen(false);
      navigate("/", { replace: true }); // ← ログイン画面など適切な場所へ
    }
  };

  return (
    <>
      {/* 浮遊ボタン */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: "80px", // HomeButton と被らないように少し上
          right: "20px",
          backgroundColor: "#ef4444",
          color: "#fff",
          padding: "12px 16px",
          borderRadius: "50%",
          border: "none",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
      >
        <LogOut size={24} />
      </button>

      {/* 確認モーダル */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              boxShadow: "0 6px 20px rgba(0,0,0,.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 10px", fontSize: "18px" }}>
              ログアウトしますか？
            </h3>
            <p style={{ fontSize: "14px", marginBottom: "16px", color: "#374151" }}>
              現在のセッション情報を削除して、トップ画面に戻ります。
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  background: "#f3f4f6",
                  cursor: "pointer",
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ef4444",
                  background: "#ef4444",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;