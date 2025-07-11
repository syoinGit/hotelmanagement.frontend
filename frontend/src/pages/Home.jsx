import React from 'react';
import { Link } from 'react-router-dom'; // ✅ 必須

const Home = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#fff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        marginBottom: '2rem'
      }}>
        Hotel Management System
      </h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/guests" style={{
          padding: '1rem 2rem',
          background: '#ffffffaa',
          borderRadius: '10px',
          textDecoration: 'none',
          color: '#000',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}>
          ゲスト一覧
        </Link>
        <Link to="/search" style={{
          padding: '1rem 2rem',
          background: '#ffffffaa',
          borderRadius: '10px',
          textDecoration: 'none',
          color: '#000',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}>
          単一検索
        </Link>
      </div>
    </div>
  );
};

export default Home;