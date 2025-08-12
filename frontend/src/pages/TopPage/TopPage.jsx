import React from "react";
import { useNavigate } from "react-router-dom";
import "./TopPage.css";
import headerImage from '../../assets/bg.png';
import logoImage from '../../assets/logo.png';

// Lucideアイコン
import { MousePointerClick, Database, TabletSmartphone } from "lucide-react";

const TopPage = () => {
  const navigate = useNavigate();

  return (
    <div className="top-page-container">
      {/* ヘッダー */}
      <header className="top-header">
        <div className="header-left">
          <img src={logoImage} alt="ロゴ" className="logo-image" />
        </div>
        <button onClick={() => navigate("/login")} className="login-button">
          ログイン
        </button>
      </header>

      {/* メインビジュアル */}
      <section className="hero">
        <img src={headerImage} alt="宿泊管理システム" className="hero-image" />
      </section>

      {/* アプリケーション説明 */}
      <section className="top-description">
        <div className="feature">
          <MousePointerClick size={36} color="#4f46e5" style={{ marginBottom: "0.5rem" }} />
          <h3>直感的な操作</h3>
          <p>誰でもすぐに使えるシンプルなUI。</p>
        </div>
        <div className="feature">
          <Database size={36} color="#4f46e5" style={{ marginBottom: "0.5rem" }} />
          <h3>情報を一元管理</h3>
          <p>宿泊者情報・予約情報を一括で管理可能。</p>
        </div>
        <div className="feature">
          <TabletSmartphone size={36} color="#4f46e5" style={{ marginBottom: "0.5rem" }} />
          <h3>タブレット対応</h3>
          <p>iPad1台で完結。紙の管理から卒業。</p>
        </div>
      </section>

      {/* スタートボタン */}
      <footer className="top-start">
        <button onClick={() => navigate("/home")} className="start-button">
          さあ、始めよう
        </button>
      </footer>
    </div>
  );
};

export default TopPage;