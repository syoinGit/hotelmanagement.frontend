// src/components/TopHeader.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Package, Search, FilePlus, PlusCircle, LogIn, LogOut, User } from 'lucide-react';
import axios from 'axios';
import logoImage from '../assets/logo.png';
import './Header.css';

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== 'undefined' && window.API_BASE) ||
  'http://localhost:8080';

const TopHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/user/logout`, {}, { withCredentials: true });
      navigate('/'); // ログアウト後トップページへ
    } catch (err) {
      console.error('ログアウト失敗:', err);
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <img src={logoImage} alt="ロゴ" className="logo-image" />
      </div>

      <nav className="header-nav">
        <Link to="/guests" className="header-button">
          <Users size={18} /> 宿泊者一覧
        </Link>
        <Link to="/bookings" className="header-button">
          <Package size={18} /> プラン一覧
        </Link>
        <Link to="/search" className="header-button">
          <Search size={18} /> 宿泊者検索・編集
        </Link>
        <Link to="/match" className="header-button">
          <FilePlus size={18} /> 予約登録
        </Link>
        <Link to="/register-booking" className="header-button">
          <PlusCircle size={18} /> プラン登録
        </Link>
        <Link to="/check-in" className="header-button">
          <LogIn size={18} /> チェックイン
        </Link>
        <Link to="/check-out" className="header-button">
          <LogOut size={18} /> チェックアウト
        </Link>

        {/* ユーザードロップダウン */}
        <div className="user-menu" style={{ position: 'relative' }}>
          <button
            className="header-button"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <User size={18} /> ユーザー
          </button>
          {menuOpen && (
            <div
              className="dropdown-menu"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: '0.5rem',
                zIndex: 999,
              }}
            >
              <button
                onClick={handleLogout}
                className="dropdown-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                }}
              >
                <LogOut size={16} /> ログアウト
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default TopHeader;