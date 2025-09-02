// src/pages/Home/Home.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  FaHome, FaUsers, FaClipboardList, FaSearch, FaFileMedical,
  FaPlusCircle, FaSignInAlt, FaSignOutAlt, FaUser
} from 'react-icons/fa';
import './Home.css';

// ルーティング用のレイアウトコンポーネント
const Home = () => {
  return (
    <div className="dash-layout">
      {/* サイドバー */}
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <FaClipboardList /> <span>ダッシュボード</span>
        </div>

        <nav className="dash-nav">
          {/* index（/home） */}
          <NavLink end to="" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaHome /> ホーム
          </NavLink>

          {/* 子ルート（/home/xxx） */}
          <NavLink to="guests" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaUsers /> 宿泊者
          </NavLink>

          <NavLink to="bookings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaClipboardList /> プラン
          </NavLink>

          <NavLink to="search" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaSearch /> 宿泊者検索
          </NavLink>

          <NavLink to="match" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaFileMedical /> 予約登録
          </NavLink>

          <NavLink to="register-booking" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaPlusCircle /> プラン登録
          </NavLink>

          <NavLink to="check-in" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaSignInAlt /> チェックイン
          </NavLink>

          <NavLink to="check-out" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaSignOutAlt /> チェックアウト
          </NavLink>

          <NavLink to="user" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <FaUser /> ユーザー
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