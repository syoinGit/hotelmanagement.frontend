// src/pages/Home/Home.jsx
import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FaHome, FaUsers, FaClipboardList, FaFileMedical,
  FaPlusCircle, FaSignInAlt, FaSignOutAlt, FaUser, // ← 人型を使う
  FaAngleDoubleLeft, FaAngleDoubleRight
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  // サイドバー開閉（localStorageに記憶）
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const raw = localStorage.getItem('dash.sidebar.collapsed');
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('dash.sidebar.collapsed', JSON.stringify(collapsed));
    } catch {}
  }, [collapsed]);

  // ログアウト確認モーダル
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelBtnRef = useRef(null);

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);

  const deleteAllCookies = () => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
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
      console.error('Logout cleanup error:', e);
    } finally {
      setConfirmOpen(false);
      navigate('/', { replace: true });
    }
  };

  // モーダル表示時に Esc / フォーカス制御
  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeConfirm();
    };
    window.addEventListener('keydown', onKey);
    // 初期フォーカス
    setTimeout(() => cancelBtnRef.current?.focus(), 0);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmOpen]);

  return (
    <div className={`dash-layout ${collapsed ? 'is-collapsed' : ''}`}>
      {/* サイドバー */}
      <aside className={`dash-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
        <div className="dash-brand">
          <FaClipboardList className="brand-icon" />
          <span className="brand-text">ダッシュボード</span>

          <button
            className="collapse-btn"
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'サイドバーを開く' : 'サイドバーを閉じる'}
            title={collapsed ? '展開' : '折りたたみ'}
          >
            {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>

        <nav className="dash-nav">
          <NavLink
            end
            to=""
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="ホーム"
          >
            <FaHome />
            <span className="nav-label">ホーム</span>
          </NavLink>

          <NavLink
            to="guests"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="宿泊者"
          >
            <FaUsers />
            <span className="nav-label">宿泊者</span>
          </NavLink>

          <NavLink
            to="bookings"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="プラン"
          >
            <FaClipboardList />
            <span className="nav-label">プラン</span>
          </NavLink>

          <NavLink
            to="match"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="予約登録"
          >
            <FaFileMedical />
            <span className="nav-label">予約登録</span>
          </NavLink>

          <NavLink
            to="register-booking"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="プラン登録"
          >
            <FaPlusCircle />
            <span className="nav-label">プラン登録</span>
          </NavLink>

          <NavLink
            to="check-in"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="チェックイン"
          >
            <FaSignInAlt />
            <span className="nav-label">チェックイン</span>
          </NavLink>

          <NavLink
            to="check-out"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="チェックアウト"
          >
            <FaSignOutAlt />
            <span className="nav-label">チェックアウト</span>
          </NavLink>

          {/* フッター：ログアウト */}
          <div className="nav-footer">
            <button
              className="nav-item logout-btn"
              type="button"
              onClick={openConfirm}
              title="ログアウト"
            >
              <FaUser className="logout-avatar" />
              <span className="nav-label">ログアウト</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* 右側：各ページをここに描画 */}
      <main className="dash-main">
        <Outlet />
      </main>

      {/* 確認モーダル */}
      {confirmOpen && (
        <div className="modal-backdrop" role="presentation" onClick={closeConfirm}>
          <div
            className="modal-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            aria-describedby="logout-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="logout-title">ログアウトしますか？</h3>
            </div>
            <p id="logout-desc" className="modal-desc">
              現在のセッション情報と保存されたCookieを削除して、最初の画面へ戻ります。
            </p>
            <div className="modal-actions">
              <button
                ref={cancelBtnRef}
                type="button"
                className="btn btn-ghost"
                onClick={closeConfirm}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleLogout}
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;