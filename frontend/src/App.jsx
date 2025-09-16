// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import RequireAuth from './routes/RequireAuth';
import TopPage from './pages/TopPage/TopPage';
import LoginPage from './pages/LoginPage/LoginPage';
import Home from './pages/Home/Home';

// 子ページ
import DashboardLanding from './pages/Home/DashboardLanding';
import GuestList from './pages/GuestListPage/GuestListPage';
import BookingListPage from './pages/BookingListPage/BookingListPage';
import SearchGuestPage from './pages/SearchGuestPage/SearchGuestPage';
import RegisterReservationPage from './pages/RegisterReservationPage/RegisterReservationPage';
import RegisterBookingPage from './pages/RegisterBookingPage/RegisterBookingPage';
import CheckInPage from './pages/CheckInPage/CheckInPage';
import CheckOutPage from './pages/CheckOutPage/CheckOutPage';
import RegisterUserPage from './pages/RegisterUserPage/RegisterUserPage';

import HomeButton from './components/HomeButton';
import LogoutButton from './components/LogoutButton'; // ★ 追加

const AppLayout = () => {
  const location = useLocation();

  // Homeボタンはトップ/ログイン/ユーザー登録では非表示
  const hideHomeButtonPaths = ['/', '/login', '/register-user'];
  const showHomeButton = !hideHomeButtonPaths.includes(location.pathname);

  // ログアウトボタンは /home 配下でのみ表示（= 認証後の画面想定）
  const showLogoutButton = location.pathname.startsWith('/home');

  return (
    <>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/login" element={<LoginPage />} />
   <Route path="/register-user" element={<RegisterUserPage />} />

        {/* /home 以下をネスト */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
            
          }
        >
          <Route index element={<DashboardLanding />} />
          <Route path="guests" element={<GuestList />} />
          <Route path="bookings" element={<BookingListPage />} />
          <Route path="search" element={<SearchGuestPage />} />
          <Route path="match" element={<RegisterReservationPage />} />
          <Route path="register-booking" element={<RegisterBookingPage />} />
          <Route path="check-in" element={<CheckInPage />} />
          <Route path="check-out" element={<CheckOutPage />} />
    
        </Route>

        {/* 旧パス → /home 配下へリダイレクト */}
        <Route path="/guests" element={<Navigate to="/home/guests" replace />} />
        <Route path="/bookings" element={<Navigate to="/home/bookings" replace />} />
        <Route path="/search" element={<Navigate to="/home/search" replace />} />
        <Route path="/match" element={<Navigate to="/home/match" replace />} />
        <Route path="/register-booking" element={<Navigate to="/home/register-booking" replace />} />
        <Route path="/check-in" element={<Navigate to="/home/check-in" replace />} />
        <Route path="/check-out" element={<Navigate to="/home/check-out" replace />} />
      </Routes>

      {showHomeButton && <HomeButton />}
      {showLogoutButton && <LogoutButton />}{/* ★ 追加（右下・HomeButtonの少し上に出ます） */}
    </>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;