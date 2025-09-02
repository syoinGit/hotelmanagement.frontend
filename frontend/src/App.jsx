// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import RequireAuth from './routes/RequireAuth';
import TopPage from './pages/TopPage/TopPage';
import LoginPage from './pages/LoginPage/LoginPage';
import Home from './pages/Home/Home'; // ← レイアウト（Sidebar + Outlet）

// 子ページ
import DashboardLanding from './pages/Home/DashboardLanding'; // ← ホーム(index)用の軽いダッシュ
import GuestList from './pages/GuestListPage/GuestListPage';
import BookingListPage from './pages/BookingListPage/BookingListPage';
import SearchGuestPage from './pages/SearchGuestPage/SearchGuestPage';
import RegisterReservationPage from './pages/RegisterReservationPage/RegisterReservationPage';
import RegisterBookingPage from './pages/RegisterBookingPage/RegisterBookingPage';
import CheckInPage from './pages/CheckInPage/CheckInPage';
import CheckOutPage from './pages/CheckOutPage/CheckOutPage';
import RegisterUserPage from './pages/RegisterUserPage/RegisterUserPage';

import HomeButton from './components/HomeButton';

const AppLayout = () => {
  const location = useLocation();
  const hideHomeButtonPaths = ['/', '/login', '/register-user'];
  const hideHomeButton = hideHomeButtonPaths.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* /home 以下をネスト */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        >
          {/* /home → ダッシュボード（インデックス） */}
          <Route index element={<DashboardLanding />} />

          {/* ここから子ルート（/home/xxx） */}
          <Route path="guests" element={<GuestList />} />
          <Route path="bookings" element={<BookingListPage />} />
          <Route path="search" element={<SearchGuestPage />} />
          <Route path="match" element={<RegisterReservationPage />} />
          <Route path="register-booking" element={<RegisterBookingPage />} />
          <Route path="check-in" element={<CheckInPage />} />
          <Route path="check-out" element={<CheckOutPage />} />
          <Route path="user" element={<RegisterUserPage />} />
        </Route>

        {/* 旧パスを /home 配下に集約したなら、リダイレクトしてもOK */}
        <Route path="/guests" element={<Navigate to="/home/guests" replace />} />
        <Route path="/bookings" element={<Navigate to="/home/bookings" replace />} />
        <Route path="/search" element={<Navigate to="/home/search" replace />} />
        <Route path="/match" element={<Navigate to="/home/match" replace />} />
        <Route path="/register-booking" element={<Navigate to="/home/register-booking" replace />} />
        <Route path="/check-in" element={<Navigate to="/home/check-in" replace />} />
        <Route path="/check-out" element={<Navigate to="/home/check-out" replace />} />
        <Route path="/register-user" element={<Navigate to="/home/user" replace />} />
      </Routes>

      {!hideHomeButton && <HomeButton />}
    </>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;