// src/components/TopHeader.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, Search, FilePlus, PlusCircle, LogIn, LogOut } from 'lucide-react';
import logoImage from '../assets/logo.png'; // 実際の画像パスに合わせてください
import './Header.css';

const TopHeader = () => {
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
      </nav>
    </header>
  );
};

export default TopHeader;