import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  FaHome, FaUsers, FaClipboardList, FaFileMedical,
  FaPlusCircle, FaSignInAlt, FaSignOutAlt, FaUser,
  FaAngleDoubleLeft, FaAngleDoubleRight
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
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
            onClick={() => setCollapsed(c => !c)}
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
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
            title="ホーム"
          >
            <FaHome />
            <span className="nav-label">ホーム</span>
          </NavLink>

          <NavLink
            to="guests"
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
            title="宿泊者"
          >
            <FaUsers />
            <span className="nav-label">宿泊者</span>
          </NavLink>

          <NavLink
            to="bookings"
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
            title="プラン"
          >
            <FaClipboardList />
            <span className="nav-label">プラン</span>
          </NavLink>

          <NavLink
            to="match"
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
            title="予約登録"
          >
            <FaFileMedical />
            <span className="nav-label">予約登録</span>
          </NavLink>

          <NavLink
            to="register-booking"
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
            title="プラン登録"
          >
            <FaPlusCircle />
            <span className="nav-label">プラン登録</span>
          </NavLink>

          <NavLink
            to="check-in"
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
            title="チェックイン"
          >
            <FaSignInAlt />
            <span className="nav-label">チェックイン</span>
          </NavLink>

          <NavLink
            to="check-out"
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
            title="チェックアウト"
          >
            <FaSignOutAlt />
            <span className="nav-label">チェックアウト</span>
          </NavLink>

          <NavLink
            to="user"
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
            title="ユーザー"
          >
            <FaUser />
            <span className="nav-label">ユーザー</span>
          </NavLink>
        </nav>
      </aside>

      {/* 右側：各ページをここに描画 */}
      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Home;